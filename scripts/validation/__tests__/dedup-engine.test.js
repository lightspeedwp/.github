/**
 * Unit tests: DedupEngine
 * Phase 5: Consolidate & Deduplicate Agent Skills
 *
 * Covers the similarity contract and locks in the per-skill caching that
 * findNearDuplicates relies on. Test files live in a temporary directory
 * because the suite fails any run that writes into the repository.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import DedupEngine from '../lib/dedup-engine.js';

const temporaryDirectories = [];

function createSkillFile(content) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dedup-engine-'));
  temporaryDirectories.push(directory);

  const file = path.join(directory, 'SKILL.md');
  fs.writeFileSync(file, content);

  return file;
}

function skill(file, name) {
  return {
    name,
    path: file,
    hash: `hash-${name}`,
    category: 'test',
    size: fs.statSync(file).size,
  };
}

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => {
    fs.rmSync(directory, { recursive: true, force: true });
  });
});

describe('DedupEngine similarity', () => {
  const engine = new DedupEngine();

  it('should score identical content as fully similar', () => {
    expect(engine.calculateSimilarity('the quick brown fox', 'the quick brown fox')).toBe(1);
  });

  it('should score unrelated content as not similar', () => {
    expect(engine.calculateSimilarity('alpha beta gamma', 'delta epsilon zeta')).toBe(0);
  });

  it('should score two empty documents as 0.4, not as identical', () => {
    // Both documents tokenize to nothing. Jaccard returns 1 because both token
    // sets are empty, cosine returns 0 because both frequency maps are empty,
    // and the weighted average is 0.6 * 0 + 0.4 * 1.
    expect(engine.calculateSimilarity('', '')).toBe(0.4);
  });

  it('should score an empty document against real content as not similar', () => {
    expect(engine.calculateSimilarity('', 'some documentation text')).toBe(0);
  });

  it('should ignore tokens of two characters or fewer', () => {
    // "a" and "is" are dropped by the tokenizer, so these two documents share
    // no surviving token: "here" against "there".
    expect(engine.tokenize('a is here')).toEqual(['here']);
    expect(engine.calculateSimilarity('a is here', 'a is there')).toBe(0);
    expect(engine.calculateSimilarity('a is here', 'a is here')).toBe(1);
  });

  it('should return a value rounded to four decimal places', () => {
    const similarity = engine.calculateSimilarity(
      'alpha beta gamma delta epsilon',
      'alpha beta gamma zeta'
    );

    expect(similarity).toBe(Number(similarity.toFixed(4)));
  });
});

describe('DedupEngine findNearDuplicates', () => {
  it('should report a near-duplicate pair above the threshold', () => {
    const engine = new DedupEngine({ threshold: 0.5 });
    const body = 'this skill validates branch names against the canonical list of types';

    const results = engine.findNearDuplicates([
      skill(createSkillFile(body), 'alpha'),
      skill(createSkillFile(`${body} exactly`), 'beta'),
    ]);

    expect(results).toHaveLength(1);
    expect(results[0].skill1.name).toBe('alpha');
    expect(results[0].skill2.name).toBe('beta');
  });

  it('should not report skills with identical hashes as near-duplicates', () => {
    const engine = new DedupEngine({ threshold: 0.5 });
    const body = 'shared content for both skills';

    const results = engine.findNearDuplicates([
      { ...skill(createSkillFile(body), 'alpha'), hash: 'same' },
      { ...skill(createSkillFile(body), 'beta'), hash: 'same' },
    ]);

    expect(results).toEqual([]);
  });

  it('should read each skill once, not once per pair', () => {
    const body = 'branch naming validation content for the caching regression test';
    const names = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'];
    const skills = names.map((name) => skill(createSkillFile(`${body} ${name}`), name));

    const realReadFileSync = fs.readFileSync.bind(fs);
    let reads = 0;
    fs.readFileSync = (...args) => {
      reads++;
      return realReadFileSync(...args);
    };

    try {
      new DedupEngine({ threshold: 0.99 }).findNearDuplicates(skills);
    } finally {
      fs.readFileSync = realReadFileSync;
    }

    // Six skills give fifteen unordered pairs. Reading inside the pair loop
    // costs two reads per pair, thirty in total; caching costs one per skill.
    expect(reads).toBe(skills.length);
  });
});
