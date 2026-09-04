/**
 * Reporting Storage Adapter Tests
 */

const fs = require("fs");
const path = require("path");
const {
  ReportingStorageRepository,
  SqlMetadataAdapter,
  NoSqlMetadataAdapter,
} = require("../reporting-storage-adapter");

const fixtures = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "reporting-storage-fixtures.json"),
    "utf-8",
  ),
);

describe("ReportingStorageRepository", () => {
  describe("adapter resolution", () => {
    test("creates SQL adapter by default", () => {
      const repository = new ReportingStorageRepository();
      expect(repository.adapter).toBeInstanceOf(SqlMetadataAdapter);
    });

    test("creates NoSQL adapter when requested", () => {
      const repository = new ReportingStorageRepository({ adapter: "nosql" });
      expect(repository.adapter).toBeInstanceOf(NoSqlMetadataAdapter);
    });

    test("throws for unsupported adapter type", () => {
      expect(() => {
        new ReportingStorageRepository({ adapter: "xml" });
      }).toThrow("Unsupported adapter type");
    });

    test("accepts custom adapter object with required methods", () => {
      const customAdapter = {
        insert: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        query: jest.fn().mockReturnValue([]),
        remove: jest.fn(),
        beginTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
      };

      const repository = new ReportingStorageRepository({
        adapter: customAdapter,
      });

      expect(repository.adapter).toBe(customAdapter);
    });

    test("throws when custom adapter is missing methods", () => {
      const customAdapter = {
        insert: jest.fn(),
      };

      expect(() => {
        new ReportingStorageRepository({ adapter: customAdapter });
      }).toThrow("Adapter missing required methods");
    });
  });

  describe("CRUD operations with SQL adapter", () => {
    let repository;

    beforeEach(() => {
      repository = new ReportingStorageRepository({
        adapter: "sql",
        seedRecords: fixtures.seedRecords,
      });
    });

    test("inserts a new metadata record", () => {
      const created = repository.insert({
        repository: "lightspeedwp/.github",
        key: "test-coverage",
        value: 0.87,
        metadata: { source: "weekly-crawl" },
      });

      expect(created.id).toContain("meta-");
      expect(created.key).toBe("test-coverage");
      expect(created.value).toBe(0.87);
    });

    test("queries inserted record by generated id", () => {
      const created = repository.insert({
        repository: "lightspeedwp/.github",
        key: "ci-pass-rate",
        value: 0.98,
      });

      const found = repository.findById(created.id);
      expect(found.value).toBe(0.98);
      expect(found.repository).toBe("lightspeedwp/.github");
    });

    test("updates existing record", () => {
      const updated = repository.update("meta-001", {
        value: 30,
        metadata: { adjusted: true },
      });

      expect(updated.value).toBe(30);
      expect(updated.metadata.period).toBe("2026-W34");
      expect(updated.metadata.adjusted).toBe(true);
    });

    test("returns null when updating unknown record", () => {
      const updated = repository.update("does-not-exist", { value: 10 });
      expect(updated).toBeNull();
    });

    test("deletes existing record", () => {
      const deleted = repository.delete("meta-002");
      expect(deleted).toBe(true);
      expect(repository.findById("meta-002")).toBeNull();
    });

    test("returns false when deleting unknown record", () => {
      expect(repository.delete("does-not-exist")).toBe(false);
    });

    test("rejects invalid record payload", () => {
      expect(() => {
        repository.insert(fixtures.invalidRecords[0]);
      }).toThrow("Record.repository must be a non-empty string");
    });

    test("rejects invalid update payload", () => {
      expect(() => {
        repository.update("meta-001", null);
      }).toThrow("Update payload must be an object");
    });
  });

  describe("CRUD operations with NoSQL adapter", () => {
    let repository;

    beforeEach(() => {
      repository = new ReportingStorageRepository({
        adapter: "nosql",
        seedRecords: fixtures.seedRecords,
      });
    });

    test("inserts record in NoSQL adapter", () => {
      const created = repository.insert({
        id: "nosql-001",
        repository: "lightspeedwp/.github",
        key: "automation-success-rate",
        value: 0.96,
      });

      expect(created.id).toBe("nosql-001");
      expect(created.value).toBe(0.96);
    });

    test("throws on duplicate id in NoSQL adapter", () => {
      expect(() => {
        repository.insert(fixtures.seedRecords[0]);
      }).toThrow("Record already exists: meta-001");
    });

    test("queries by key in NoSQL adapter", () => {
      const matches = repository.query({ key: "issues-open" });
      expect(matches.length).toBe(1);
      expect(matches[0].id).toBe("meta-001");
    });

    test("updates NoSQL metadata with merge behaviour", () => {
      const updated = repository.update("meta-001", {
        metadata: { reviewer: "automation" },
      });

      expect(updated.metadata.source).toBe("weekly-crawl");
      expect(updated.metadata.reviewer).toBe("automation");
    });

    test("returns null for missing NoSQL record", () => {
      expect(repository.findById("missing")).toBeNull();
    });

    test("returns false for missing NoSQL delete", () => {
      expect(repository.delete("missing")).toBe(false);
    });
  });

  describe("query options", () => {
    let repository;

    beforeEach(() => {
      repository = new ReportingStorageRepository({
        adapter: "sql",
        seedRecords: fixtures.seedRecords,
      });

      repository.insert({
        id: "meta-003",
        repository: "lightspeedwp/.github",
        key: "issues-open",
        value: 38,
        captured_at: "2026-08-21T00:00:00.000Z",
      });

      repository.insert({
        id: "meta-004",
        repository: "lightspeedwp/.github",
        key: "issues-open",
        value: 35,
        captured_at: "2026-08-22T00:00:00.000Z",
      });
    });

    test("supports function-based criteria", () => {
      const results = repository.query({
        value: (value) => value >= 38,
      });

      expect(results.every((record) => record.value >= 38)).toBe(true);
    });

    test("sorts ascending by captured_at by default", () => {
      const results = repository.query({ key: "issues-open" });
      expect(results[0].id).toBe("meta-001");
      expect(results[results.length - 1].id).toBe("meta-004");
    });

    test("sorts descending when requested", () => {
      const results = repository.query(
        { key: "issues-open" },
        { sortOrder: "desc" },
      );

      expect(results[0].id).toBe("meta-004");
      expect(results[results.length - 1].id).toBe("meta-001");
    });

    test("supports limit and offset", () => {
      const results = repository.query(
        { key: "issues-open" },
        { sortOrder: "asc", offset: 1, limit: 1 },
      );

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("meta-003");
    });

    test("rejects invalid query criteria", () => {
      expect(() => {
        repository.query(null);
      }).toThrow("Query criteria must be an object");
    });

    test("treats limit 0 as no limit", () => {
      const results = repository.query(
        { key: "issues-open" },
        { sortOrder: "asc", limit: 0 },
      );

      expect(results).toHaveLength(3);
    });

    test("rejects negative limit", () => {
      expect(() => {
        repository.query({ key: "issues-open" }, { limit: -1 });
      }).toThrow("limit must be non-negative");
    });
  });

  describe("transaction support", () => {
    let repository;

    beforeEach(() => {
      repository = new ReportingStorageRepository({
        adapter: "nosql",
        seedRecords: fixtures.seedRecords,
      });
    });

    test("commits manual transaction changes", () => {
      const transaction = repository.beginTransaction();
      repository.insert({
        id: "tx-keep",
        repository: "lightspeedwp/.github",
        key: "coverage",
        value: 89,
      });

      repository.commitTransaction(transaction);
      expect(repository.findById("tx-keep")).not.toBeNull();
    });

    test("rolls back manual transaction changes", () => {
      const transaction = repository.beginTransaction();
      repository.insert({
        id: "tx-drop",
        repository: "lightspeedwp/.github",
        key: "coverage",
        value: 67,
      });

      repository.rollbackTransaction(transaction);
      expect(repository.findById("tx-drop")).toBeNull();
    });

    test("throws for commit without transaction id", () => {
      expect(() => {
        repository.commitTransaction({});
      }).toThrow("Transaction object with id is required");
    });

    test("throws for unknown transaction rollback", () => {
      expect(() => {
        repository.rollbackTransaction({ id: "tx-missing" });
      }).toThrow("Unknown transaction");
    });
  });

  describe("bulk operations for historical backfill", () => {
    let repository;

    beforeEach(() => {
      repository = new ReportingStorageRepository({ adapter: "sql" });
    });

    test("bulk backfill inserts historical records", () => {
      const result = repository.bulkBackfill(fixtures.backfillRecords, {
        batchSize: 2,
      });

      expect(result.processed).toBe(3);
      expect(result.inserted).toBe(3);
      expect(result.updated).toBe(0);
      expect(result.failed).toBe(0);
      expect(result.batches).toBe(2);
    });

    test("bulk backfill upserts existing records", () => {
      repository.insert(fixtures.backfillRecords[0]);

      const updatedRecord = {
        ...fixtures.backfillRecords[0],
        value: 51,
        metadata: { source: "backfill-correction" },
      };

      const result = repository.bulkBackfill([updatedRecord]);
      const found = repository.findById("hist-001");

      expect(result.inserted).toBe(0);
      expect(result.updated).toBe(1);
      expect(found.value).toBe(51);
      expect(found.metadata.source).toBe("backfill-correction");
    });

    test("bulk insert rejects duplicates", () => {
      repository.insert(fixtures.backfillRecords[0]);

      expect(() => {
        repository.bulkInsert([fixtures.backfillRecords[0]]);
      }).toThrow("Bulk backfill failed: Record already exists");
    });

    test("bulk backfill rolls back on atomic failure", () => {
      expect(() => {
        repository.bulkBackfill([
          ...fixtures.backfillRecords,
          fixtures.invalidRecords[0],
        ]);
      }).toThrow("Bulk backfill failed");

      expect(repository.query({})).toHaveLength(0);
    });

    test("bulk backfill can continue on non-atomic failure", () => {
      const result = repository.bulkBackfill(
        [...fixtures.backfillRecords, fixtures.invalidRecords[1]],
        { atomic: false, transaction: false },
      );

      expect(result.processed).toBe(4);
      expect(result.inserted).toBe(3);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(repository.query({})).toHaveLength(3);
    });

    test("bulk backfill rejects non-array payload", () => {
      expect(() => {
        repository.bulkBackfill(null);
      }).toThrow("Bulk records must be an array");
    });

    test("bulk backfill validates batch size", () => {
      expect(() => {
        repository.bulkBackfill(fixtures.backfillRecords, { batchSize: 0 });
      }).toThrow("batchSize must be a positive integer");
    });

    test("bulk insert uses non-upsert mode", () => {
      const result = repository.bulkInsert(fixtures.backfillRecords);
      expect(result.inserted).toBe(3);
      expect(result.updated).toBe(0);
    });

    test("throws when commit fails during transactional backfill", () => {
      const repositoryWithCommitFailure = new ReportingStorageRepository({
        adapter: "sql",
      });
      const commitSpy = jest
        .spyOn(repositoryWithCommitFailure.adapter, "commitTransaction")
        .mockImplementation(() => {
          throw new Error("commit failed");
        });

      expect(() => {
        repositoryWithCommitFailure.bulkBackfill(fixtures.backfillRecords, {
          transaction: true,
          atomic: false,
        });
      }).toThrow("Bulk backfill failed: commit failed");

      expect(repositoryWithCommitFailure.query({})).toHaveLength(0);
      commitSpy.mockRestore();
    });
  });

  describe("SQL adapter serialisation", () => {
    test("SQL adapter stores and restores object values", () => {
      const repository = new ReportingStorageRepository({ adapter: "sql" });
      repository.insert({
        id: "obj-1",
        repository: "lightspeedwp/.github",
        key: "quality",
        value: { lint: 1, tests: 1 },
      });

      const found = repository.findById("obj-1");
      expect(found.value).toEqual({ lint: 1, tests: 1 });
    });

    test("SQL adapter query can match repository", () => {
      const repository = new ReportingStorageRepository({
        adapter: "sql",
        seedRecords: fixtures.seedRecords,
      });

      const results = repository.query({ repository: "lightspeedwp/.github" });
      expect(results).toHaveLength(2);
    });
  });
});
