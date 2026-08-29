/**
 * Reporting Storage Adapter
 *
 * Repository abstraction with SQL/NoSQL adapter support for metadata persistence.
 * Includes CRUD operations, bulk historical backfill, and transaction support.
 */

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
}

class BaseInMemoryAdapter {
  constructor(type) {
    this.type = type;
    this.records = [];
    this.transactionCounter = 0;
    this.transactionSnapshots = new Map();
  }

  beginTransaction() {
    const id = `tx-${this.type}-${++this.transactionCounter}`;
    this.transactionSnapshots.set(id, deepClone(this.records));
    return { id, type: this.type };
  }

  commitTransaction(transaction) {
    this.assertTransaction(transaction);
    this.transactionSnapshots.delete(transaction.id);
    return true;
  }

  rollbackTransaction(transaction) {
    this.assertTransaction(transaction);
    const snapshot = this.transactionSnapshots.get(transaction.id);
    this.records = deepClone(snapshot);
    this.transactionSnapshots.delete(transaction.id);
    return true;
  }

  assertTransaction(transaction) {
    if (!transaction || !transaction.id) {
      throw new Error("Transaction object with id is required");
    }

    if (!this.transactionSnapshots.has(transaction.id)) {
      throw new Error(`Unknown transaction: ${transaction.id}`);
    }
  }
}

class SqlMetadataAdapter extends BaseInMemoryAdapter {
  constructor(seedRecords = []) {
    super("sql");
    this.seed(seedRecords);
  }

  seed(records) {
    records.forEach((record) => {
      const row = this.mapRecordToRow(record);
      const existingIndex = this.records.findIndex((r) => r.id === row.id);
      if (existingIndex >= 0) {
        this.records[existingIndex] = row;
      } else {
        this.records.push(row);
      }
    });
  }

  insert(record) {
    const row = this.mapRecordToRow(record);
    if (this.records.some((existing) => existing.id === row.id)) {
      throw new Error(`Record already exists: ${row.id}`);
    }

    this.records.push(row);
    return this.mapRowToRecord(row);
  }

  update(id, updates) {
    const index = this.records.findIndex((row) => row.id === id);
    if (index < 0) {
      return null;
    }

    const currentRecord = this.mapRowToRecord(this.records[index]);
    const merged = {
      ...currentRecord,
      ...updates,
      id,
      metadata: {
        ...(currentRecord.metadata || {}),
        ...(updates.metadata || {}),
      },
      updated_at: updates.updated_at || new Date().toISOString(),
    };

    const row = this.mapRecordToRow(merged);
    this.records[index] = row;
    return this.mapRowToRecord(row);
  }

  findById(id) {
    const row = this.records.find((record) => record.id === id);
    return row ? this.mapRowToRecord(row) : null;
  }

  query(criteria = {}) {
    return this.records
      .map((row) => this.mapRowToRecord(row))
      .filter((record) => this.matchesCriteria(record, criteria));
  }

  remove(id) {
    const index = this.records.findIndex((record) => record.id === id);
    if (index < 0) {
      return false;
    }

    this.records.splice(index, 1);
    return true;
  }

  mapRecordToRow(record) {
    return {
      id: record.id,
      repository: record.repository,
      key_name: record.key,
      value_json: JSON.stringify(record.value ?? null),
      metadata_json: JSON.stringify(record.metadata || {}),
      captured_at: record.captured_at || new Date().toISOString(),
      created_at: record.created_at || new Date().toISOString(),
      updated_at: record.updated_at || new Date().toISOString(),
    };
  }

  mapRowToRecord(row) {
    return {
      id: row.id,
      repository: row.repository,
      key: row.key_name,
      value: JSON.parse(row.value_json),
      metadata: JSON.parse(row.metadata_json),
      captured_at: row.captured_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  matchesCriteria(record, criteria) {
    return Object.entries(criteria).every(([field, expected]) => {
      if (typeof expected === "function") {
        return expected(record[field], record);
      }

      return record[field] === expected;
    });
  }
}

class NoSqlMetadataAdapter extends BaseInMemoryAdapter {
  constructor(seedRecords = []) {
    super("nosql");
    this.seed(seedRecords);
  }

  seed(records) {
    records.forEach((record) => {
      const existingIndex = this.records.findIndex((r) => r.id === record.id);
      const cloned = deepClone(record);
      if (existingIndex >= 0) {
        this.records[existingIndex] = cloned;
      } else {
        this.records.push(cloned);
      }
    });
  }

  insert(record) {
    if (this.records.some((existing) => existing.id === record.id)) {
      throw new Error(`Record already exists: ${record.id}`);
    }

    const cloned = deepClone(record);
    this.records.push(cloned);
    return deepClone(cloned);
  }

  update(id, updates) {
    const index = this.records.findIndex((record) => record.id === id);
    if (index < 0) {
      return null;
    }

    const merged = {
      ...this.records[index],
      ...deepClone(updates),
      id,
      metadata: {
        ...(this.records[index].metadata || {}),
        ...(updates.metadata || {}),
      },
      updated_at: updates.updated_at || new Date().toISOString(),
    };

    this.records[index] = merged;
    return deepClone(merged);
  }

  findById(id) {
    const found = this.records.find((record) => record.id === id);
    return found ? deepClone(found) : null;
  }

  query(criteria = {}) {
    return this.records
      .filter((record) => this.matchesCriteria(record, criteria))
      .map((record) => deepClone(record));
  }

  remove(id) {
    const index = this.records.findIndex((record) => record.id === id);
    if (index < 0) {
      return false;
    }

    this.records.splice(index, 1);
    return true;
  }

  matchesCriteria(record, criteria) {
    return Object.entries(criteria).every(([field, expected]) => {
      if (typeof expected === "function") {
        return expected(record[field], record);
      }

      return record[field] === expected;
    });
  }
}

class ReportingStorageRepository {
  constructor(options = {}) {
    const { adapter = "sql", seedRecords = [] } = options;
    this.idCounter = 0;
    this.adapter = this.resolveAdapter(adapter, seedRecords);
  }

  resolveAdapter(adapter, seedRecords) {
    if (typeof adapter === "string") {
      if (adapter === "sql") {
        return new SqlMetadataAdapter(seedRecords);
      }

      if (adapter === "nosql") {
        return new NoSqlMetadataAdapter(seedRecords);
      }

      throw new Error(`Unsupported adapter type: ${adapter}`);
    }

    const requiredMethods = [
      "insert",
      "update",
      "findById",
      "query",
      "remove",
      "beginTransaction",
      "commitTransaction",
      "rollbackTransaction",
    ];

    const missing = requiredMethods.filter(
      (method) => typeof adapter[method] !== "function",
    );

    if (missing.length > 0) {
      throw new Error(
        `Adapter missing required methods: ${missing.join(", ")}`,
      );
    }

    return adapter;
  }

  beginTransaction() {
    return this.adapter.beginTransaction();
  }

  commitTransaction(transaction) {
    return this.adapter.commitTransaction(transaction);
  }

  rollbackTransaction(transaction) {
    return this.adapter.rollbackTransaction(transaction);
  }

  insert(record) {
    const prepared = this.prepareRecord(record);
    return this.adapter.insert(prepared);
  }

  update(id, updates) {
    ensureObject(updates, "Update payload must be an object");
    return this.adapter.update(id, updates);
  }

  findById(id) {
    return this.adapter.findById(id);
  }

  query(criteria = {}, options = {}) {
    ensureObject(criteria, "Query criteria must be an object");
    const records = this.adapter.query(criteria);
    return this.applyQueryOptions(records, options);
  }

  delete(id) {
    return this.adapter.remove(id);
  }

  bulkInsert(records, options = {}) {
    return this.bulkBackfill(records, {
      ...options,
      upsert: false,
    });
  }

  bulkBackfill(records, options = {}) {
    if (!Array.isArray(records)) {
      throw new Error("Bulk records must be an array");
    }

    const {
      batchSize = 100,
      transaction = true,
      atomic = true,
      upsert = true,
    } = options;

    if (!Number.isInteger(batchSize) || batchSize <= 0) {
      throw new Error("batchSize must be a positive integer");
    }

    const tx = transaction ? this.beginTransaction() : null;
    const result = {
      processed: 0,
      inserted: 0,
      updated: 0,
      failed: 0,
      batches: 0,
      errors: [],
    };

    try {
      for (let index = 0; index < records.length; index += batchSize) {
        const batch = records.slice(index, index + batchSize);
        result.batches += 1;

        batch.forEach((record, offset) => {
          const globalIndex = index + offset;
          try {
            const prepared = this.prepareRecord(record);
            const existing = this.findById(prepared.id);

            if (existing && upsert) {
              this.update(prepared.id, prepared);
              result.updated += 1;
            } else {
              if (existing && !upsert) {
                throw new Error(`Record already exists: ${prepared.id}`);
              }
              this.adapter.insert(prepared);
              result.inserted += 1;
            }

            result.processed += 1;
          } catch (error) {
            result.failed += 1;
            result.errors.push({
              index: globalIndex,
              message: error.message,
            });

            if (atomic) {
              throw error;
            }
          }
        });
      }

      if (tx) {
        this.commitTransaction(tx);
      }

      return result;
    } catch (error) {
      if (tx) {
        this.rollbackTransaction(tx);
      }

      if (atomic) {
        throw new Error(`Bulk backfill failed: ${error.message}`);
      }

      return result;
    }
  }

  prepareRecord(record) {
    ensureObject(record, "Record must be an object");

    if (!record.repository || typeof record.repository !== "string") {
      throw new Error("Record.repository must be a non-empty string");
    }

    if (!record.key || typeof record.key !== "string") {
      throw new Error("Record.key must be a non-empty string");
    }

    return {
      id: record.id || this.generateId(),
      repository: record.repository,
      key: record.key,
      value: deepClone(record.value ?? null),
      metadata: deepClone(record.metadata || {}),
      captured_at: record.captured_at || new Date().toISOString(),
      created_at: record.created_at || new Date().toISOString(),
      updated_at: record.updated_at || new Date().toISOString(),
    };
  }

  generateId() {
    this.idCounter += 1;
    return `meta-${Date.now()}-${this.idCounter}`;
  }

  applyQueryOptions(records, options) {
    const {
      sortBy = "captured_at",
      sortOrder = "asc",
      offset = 0,
      limit,
    } = options;

    const sorted = [...records].sort((a, b) => {
      const left = a[sortBy];
      const right = b[sortBy];

      if (left === right) {
        return 0;
      }

      if (sortOrder === "desc") {
        return left < right ? 1 : -1;
      }

      return left > right ? 1 : -1;
    });

    const start = Math.max(0, offset);
    const sliced = sorted.slice(start);

    if (typeof limit !== "number") {
      return sliced;
    }

    return sliced.slice(0, Math.max(0, limit));
  }
}

module.exports = {
  ReportingStorageRepository,
  SqlMetadataAdapter,
  NoSqlMetadataAdapter,
};
