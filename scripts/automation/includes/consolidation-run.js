/**
 * Run identity, run lock and append-only log for the label consolidation
 * (spec 008, FR-023 points 1, 2, 8, 10 and 11; research R21).
 *
 * A run takes `run-lock.json` with an exclusive create, so two runs starting
 * together cannot both hold it. The lock records the `run_id`, an `epoch` and
 * the host and process of the holder. Every append re-reads the lock and
 * refuses when the run is no longer its holder at its own epoch, so a run that
 * was taken over cannot keep writing.
 *
 * Liveness note: Node has no `flock`, so "the operating system has released the
 * stopped run's lock" is checked by probing the holder's process (same host
 * only). A lock written by another host is never taken over by `--resume`; it
 * needs `--abandon-run`, confirmed on the gate issue.
 *
 * Log lines are JSON Lines. Each change is written twice with one `op_id`: an
 * `intended` record flushed to disk before the API call and a `done` record
 * flushed after it succeeds.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const LOCK_FILE_NAME = 'run-lock.json';
export const STAGES = new Set(['3', '4', '5']);

/** The lock is held by another run, or the caller is not its holder. */
export class RunLockError extends Error {
  /**
   * @param {string} message - What is wrong
   * @param {string | null} [runId] - The run that holds the lock, when known
   */
  constructor(message, runId = null, options = undefined) {
    super(message, options);
    this.name = 'RunLockError';
    this.runId = runId;
  }
}

/** A holder whose epoch is no longer the lock's tried to write. */
export class StaleEpochError extends RunLockError {
  constructor(message, runId = null) {
    super(message, runId);
    this.name = 'StaleEpochError';
  }
}

/**
 * Builds a run id: the UTC start time to the second plus eight random hex digits.
 * @param {Date} [now] - Start time
 * @param {(size: number) => Buffer} [randomBytes] - Random source, for tests
 * @returns {string} For example `run-20261005T090000-3f9a1c7e`
 */
export function createRunId(now = new Date(), randomBytes = crypto.randomBytes) {
  const stamp = now
    .toISOString()
    .replace(/\.\d{3}Z$/, '')
    .replace(/[-:]/g, '');
  return `run-${stamp}-${randomBytes(4).toString('hex')}`;
}

/**
 * Builds an operation id that starts with its run id.
 * @param {string} runId - The run that writes the change
 * @param {number} sequence - Per-run sequence number, starting at 1
 * @returns {string} For example `run-20261005T090000-3f9a1c7e-0001`
 */
export function createOpId(runId, sequence) {
  return `${runId}-${String(sequence).padStart(4, '0')}`;
}

/**
 * Tells whether a process is alive on this host.
 * @param {number} pid - Process id
 * @returns {boolean} False only when the process does not exist
 */
export function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM means the process exists but belongs to someone else.
    return error.code === 'EPERM';
  }
}

/**
 * Reads a lock file.
 * @param {string} lockPath - Path of `run-lock.json`
 * @returns {object | null} The lock, or null when there is none
 */
export function readLock(lockPath) {
  try {
    return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw new RunLockError(`Cannot read ${lockPath}: ${error.message}`, null, { cause: error });
  }
}

/**
 * Writes bytes and flushes them to disk before returning.
 * @param {string} filePath - Target file
 * @param {string} data - Text to append
 */
function appendDurably(filePath, data) {
  const fd = fs.openSync(filePath, 'a');
  try {
    fs.writeSync(fd, data);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * Trims a log back to its last newline, keeping the removed bytes in a
 * `.partial` file beside it, so the next record cannot join a cut-off line.
 * @param {string} logPath - JSON Lines file
 * @returns {number} Bytes removed
 */
export function truncatePartialLine(logPath) {
  if (!fs.existsSync(logPath)) {
    return 0;
  }
  const content = fs.readFileSync(logPath);
  if (content.length === 0 || content[content.length - 1] === 0x0a) {
    return 0;
  }
  const lastNewline = content.lastIndexOf(0x0a);
  const keep = lastNewline + 1;
  const removed = content.subarray(keep);
  appendDurably(`${logPath}.partial`, `${removed.toString('utf8')}\n`);
  const fd = fs.openSync(logPath, 'r+');
  try {
    fs.ftruncateSync(fd, keep);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  return removed.length;
}

/**
 * Reads a JSON Lines log. A last line that does not parse is the interrupted
 * write and is ignored; an unparsable line anywhere else is an error.
 * @param {string} logPath - JSON Lines file
 * @returns {object[]} Records in order
 */
export function readLog(logPath) {
  if (!fs.existsSync(logPath)) {
    return [];
  }
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  const records = [];
  lines.forEach((line, index) => {
    if (line.trim() === '') {
      return;
    }
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      const isLast = lines.slice(index + 1).every((rest) => rest.trim() === '');
      if (!isLast) {
        throw new Error(`${logPath} line ${index + 1} is not valid JSON: ${error.message}`, {
          cause: error,
        });
      }
    }
  });
  return records;
}

/**
 * Finds `intended` records that have no matching `done` record.
 * @param {object[]} records - Log records
 * @param {string} [runId] - Only this run's records, when given
 * @returns {object[]} Unmatched `intended` records in order
 */
export function unmatchedIntended(records, runId) {
  const done = new Set(records.filter((r) => r.state === 'done').map((r) => r.op_id));
  return records.filter(
    (record) =>
      record.state === 'intended' &&
      !done.has(record.op_id) &&
      (runId === undefined || String(record.op_id).startsWith(`${runId}-`))
  );
}

/**
 * Starts a run: takes the lock with an exclusive create.
 * @param {object} options
 * @param {string} options.dir - Directory that holds `run-lock.json`
 * @param {string} options.runBy - GitHub login of the person running the tool
 * @param {string} options.stage - `3`, `4` or `5`
 * @param {() => Date} [options.now] - Clock, for tests
 * @param {string} [options.host] - Host name, for tests
 * @param {number} [options.pid] - Process id, for tests
 * @returns {object} The run handle
 */
export function startRun({
  dir,
  runBy,
  stage,
  now = () => new Date(),
  host = os.hostname(),
  pid = process.pid,
}) {
  if (!STAGES.has(String(stage))) {
    throw new RunLockError(`Stage must be 3, 4 or 5, not ${stage}`);
  }
  fs.mkdirSync(dir, { recursive: true });
  const lockPath = path.join(dir, LOCK_FILE_NAME);
  const startedAt = now();
  const lock = {
    run_id: createRunId(startedAt),
    run_by: runBy,
    started_at: startedAt.toISOString(),
    stage: String(stage),
    epoch: 1,
    host,
    pid,
    resumed_from: null,
  };
  try {
    fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`, { flag: 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST') {
      const existing = readLock(lockPath);
      throw new RunLockError(
        `A consolidation run already holds ${LOCK_FILE_NAME}${existing?.run_id ? ` (${existing.run_id})` : ''}. ` +
          'Resume it with --resume <run_id>, or abandon it with --abandon-run <run_id> after confirmation on the gate issue.',
        existing?.run_id ?? null
      );
    }
    throw error;
  }
  return makeHandle(lockPath, lock);
}

/**
 * Path of the claim file for an epoch.
 * @param {string} lockPath - Path of `run-lock.json`
 * @param {number} epoch - The epoch being claimed
 * @returns {string} Claim file path
 */
function epochClaimPath(lockPath, epoch) {
  return `${lockPath}.epoch-${epoch}`;
}

/**
 * Removes the claim files beside a lock once the run is over.
 * @param {string} lockPath - Path of `run-lock.json`
 */
function removeEpochClaims(lockPath) {
  const dir = path.dirname(lockPath);
  const prefix = `${path.basename(lockPath)}.epoch-`;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(prefix)) {
      fs.rmSync(path.join(dir, name), { force: true });
    }
  }
}

/**
 * Takes over a stopped run: same run id, epoch raised by one.
 * @param {object} options
 * @param {string} options.dir - Directory that holds `run-lock.json`
 * @param {string} options.runId - The run to resume
 * @param {() => Date} [options.now] - Clock, for tests
 * @param {string} [options.host] - Host name, for tests
 * @param {number} [options.pid] - Process id, for tests
 * @param {(pid: number) => boolean} [options.isAlive] - Liveness probe, for tests
 * @returns {object} The run handle, with the lock's previous holder in `resumed_from`
 */
export function resumeRun({
  dir,
  runId,
  now = () => new Date(),
  host = os.hostname(),
  pid = process.pid,
  isAlive = processIsAlive,
}) {
  const lockPath = path.join(dir, LOCK_FILE_NAME);
  const lock = readLock(lockPath);
  if (!lock) {
    throw new RunLockError(`There is no ${LOCK_FILE_NAME} to resume.`);
  }
  if (lock.run_id !== runId) {
    throw new RunLockError(
      `${LOCK_FILE_NAME} belongs to ${lock.run_id}, not ${runId}.`,
      lock.run_id
    );
  }
  if (lock.host !== host) {
    throw new RunLockError(
      `Run ${runId} was started on ${lock.host}; its lock cannot be checked from ${host}. ` +
        'Resume it there, or abandon it with --abandon-run after confirmation on the gate issue.',
      runId
    );
  }
  if (isAlive(lock.pid)) {
    throw new RunLockError(
      `Run ${runId} is still running (process ${lock.pid}); resume only a stopped run.`,
      runId
    );
  }
  const next = {
    ...lock,
    epoch: lock.epoch + 1,
    host,
    pid,
    resumed_from: { epoch: lock.epoch, at: now().toISOString() },
  };
  // Claim the new epoch with an exclusive create. Reading the lock, probing the
  // pid and replacing the lock are not one atomic step, so two resumers could
  // both see epoch N, both write N+1, and both pass the holder check. Only one
  // of them can create the claim file for epoch N+1.
  const claimPath = epochClaimPath(lockPath, next.epoch);
  try {
    fs.writeFileSync(
      claimPath,
      `${JSON.stringify({ run_id: runId, epoch: next.epoch, pid, host })}\n`,
      { flag: 'wx' }
    );
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new RunLockError(
        `Another process already claimed epoch ${next.epoch} of ${runId}; it is resuming this run.`,
        runId,
        { cause: error }
      );
    }
    throw error;
  }
  // Replace atomically so a crash cannot leave a half-written lock.
  const temporary = `${lockPath}.${pid}.tmp`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`);
    fs.renameSync(temporary, lockPath);
  } catch (error) {
    fs.rmSync(claimPath, { force: true });
    fs.rmSync(temporary, { force: true });
    throw error;
  }
  return makeHandle(lockPath, next);
}

/**
 * Attaches to the current lock without changing it, for the `record`
 * subcommand that logs steps done by hand under a run's lock (T063).
 * @param {object} options
 * @param {string} options.dir - Directory that holds `run-lock.json`
 * @param {string} options.runId - The run whose lock is current
 * @returns {object} A run handle at the lock's current epoch
 */
export function attachRun({ dir, runId }) {
  const lockPath = path.join(dir, LOCK_FILE_NAME);
  const lock = readLock(lockPath);
  if (!lock || lock.run_id !== runId) {
    throw new RunLockError(`There is no lock for ${runId} to attach to.`, lock?.run_id ?? null);
  }
  return makeHandle(lockPath, lock);
}

/**
 * Removes the lock of a run that will not be resumed. The caller must already
 * have checked the confirmation on the gate issue.
 * @param {object} options
 * @param {string} options.dir - Directory that holds `run-lock.json`
 * @param {string} options.runId - The run to abandon
 * @returns {object} The removed lock
 */
export function abandonRun({ dir, runId }) {
  const lockPath = path.join(dir, LOCK_FILE_NAME);
  const lock = readLock(lockPath);
  if (!lock || lock.run_id !== runId) {
    throw new RunLockError(`There is no lock for ${runId} to abandon.`, lock?.run_id ?? null);
  }
  fs.unlinkSync(lockPath);
  removeEpochClaims(lockPath);
  return lock;
}

/**
 * Builds the handle a run writes through.
 * @param {string} lockPath - Path of `run-lock.json`
 * @param {object} lock - The lock this run holds
 * @returns {object} Handle with `append`, `finish` and run identity fields
 */
function makeHandle(lockPath, lock) {
  let sequence = 0;
  let finished = false;

  /** Refuses to continue unless this run still holds the lock at its epoch. */
  function assertHolder() {
    const current = readLock(lockPath);
    if (!current || current.run_id !== lock.run_id || current.epoch !== lock.epoch) {
      throw new StaleEpochError(
        `Run ${lock.run_id} (epoch ${lock.epoch}) no longer holds ${LOCK_FILE_NAME}; it must not write.`,
        current?.run_id ?? null
      );
    }
  }

  return {
    runId: lock.run_id,
    runBy: lock.run_by,
    stage: lock.stage,
    epoch: lock.epoch,
    resumedFrom: lock.resumed_from,
    assertHolder,
    /** @returns {string} The next operation id for this run. */
    nextOpId() {
      sequence += 1;
      return createOpId(lock.run_id, sequence);
    },
    /**
     * Continues numbering after the highest sequence already in a log, so a
     * resumed run never reuses an `op_id` of its own earlier records.
     * @param {object[]} records - Records already in the log
     */
    continueFrom(records) {
      const prefix = `${lock.run_id}-`;
      for (const record of records) {
        if (typeof record.op_id === 'string' && record.op_id.startsWith(prefix)) {
          const value = Number(record.op_id.slice(prefix.length));
          if (Number.isInteger(value) && value > sequence) {
            sequence = value;
          }
        }
      }
    },
    /**
     * Appends one record to a log file, flushed to disk. Only the holder may.
     * @param {string} logPath - JSON Lines file
     * @param {object} record - Log record
     */
    append(logPath, record) {
      assertHolder();
      if (finished) {
        throw new RunLockError(`Run ${lock.run_id} has finished and cannot append.`);
      }
      fs.mkdirSync(path.dirname(logPath), { recursive: true });
      appendDurably(logPath, `${JSON.stringify(record)}\n`);
    },
    /**
     * Ends the run: deletes the lock. Call only when no `intended` record of
     * this run is left unmatched.
     */
    finish() {
      assertHolder();
      finished = true;
      fs.unlinkSync(lockPath);
      removeEpochClaims(lockPath);
    },
  };
}

export default {
  LOCK_FILE_NAME,
  RunLockError,
  StaleEpochError,
  createRunId,
  createOpId,
  processIsAlive,
  readLock,
  truncatePartialLine,
  readLog,
  unmatchedIntended,
  startRun,
  resumeRun,
  attachRun,
  abandonRun,
};
