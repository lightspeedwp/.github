/**
 * Batch Operations with Concurrency Control
 *
 * Provides utilities for executing multiple asynchronous operations
 * with configurable concurrency limits and progress tracking.
 *
 * Usage:
 *   const batcher = new BatchOperations({ concurrency: 5 });
 *   const results = await batcher.execute(tasks, processor);
 */

export class BatchOperations {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 5;
    this.verbose = options.verbose || false;
  }

  /**
   * Execute batch of tasks with concurrency control
   */
  async execute(tasks, processor, _options = {}) {
    const results = [];
    const errors = [];
    const queue = [...tasks];
    let activeCount = 0;
    let completed = 0;
    const total = tasks.length;

    return new Promise((resolve, _reject) => {
      const processNext = async () => {
        if (queue.length === 0 && activeCount === 0) {
          if (this.verbose) {
            console.log(`✓ Completed ${completed}/${total} tasks`);
          }
          resolve({ results, errors, completed, total });
          return;
        }

        if (queue.length === 0 || activeCount >= this.concurrency) {
          return;
        }

        activeCount++;
        const task = queue.shift();
        const taskIndex = total - queue.length - 1;

        try {
          const result = await processor(task, taskIndex);
          results.push({
            task,
            result,
            status: "success",
          });

          if (
            this.verbose &&
            (completed + 1) % Math.max(1, Math.floor(total / 10)) === 0
          ) {
            console.log(`  Progress: ${completed + 1}/${total}`);
          }

          completed++;
        } catch (error) {
          errors.push({
            task,
            error: error.message || error,
            status: "error",
          });
          completed++;

          if (this.verbose) {
            console.error(`  Error processing task:`, error.message);
          }
        }

        activeCount--;
        processNext();
        processNext(); // Continue processing
      };

      // Start initial batch of workers
      for (let i = 0; i < this.concurrency && i < queue.length; i++) {
        processNext();
      }
    });
  }

  /**
   * Execute batch and collect only results (no errors)
   */
  async executeResults(tasks, processor) {
    const { results } = await this.execute(tasks, processor);
    return results.map((r) => r.result);
  }

  /**
   * Execute batch with timeout per task
   */
  async executeWithTimeout(tasks, processor, timeoutMs = 30000) {
    const timeoutProcessor = async (task, index) => {
      return Promise.race([
        processor(task, index),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Task timeout after ${timeoutMs}ms`)),
            timeoutMs,
          ),
        ),
      ]);
    };

    return this.execute(tasks, timeoutProcessor);
  }

  /**
   * Execute batch with retry logic per task
   */
  async executeWithRetry(tasks, processor, maxRetries = 3) {
    const retryProcessor = async (task, index) => {
      let lastError;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await processor(task, index);
        } catch (error) {
          lastError = error;
          if (attempt < maxRetries - 1) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError;
    };

    return this.execute(tasks, retryProcessor);
  }

  /**
   * Map tasks to results using async processor
   */
  async map(tasks, processor) {
    const results = await this.executeResults(tasks, processor);
    return results;
  }

  /**
   * Filter tasks based on async predicate
   */
  async filter(tasks, predicate) {
    const results = [];

    for (const task of tasks) {
      const keep = await predicate(task);
      if (keep) {
        results.push(task);
      }
    }

    return results;
  }

  /**
   * Process tasks in batches of N
   */
  async processBatches(tasks, batchSize, processor) {
    const batches = [];

    for (let i = 0; i < tasks.length; i += batchSize) {
      batches.push(tasks.slice(i, i + batchSize));
    }

    const results = [];

    for (let i = 0; i < batches.length; i++) {
      if (this.verbose) {
        console.log(`Processing batch ${i + 1}/${batches.length}`);
      }

      const batchResults = await Promise.all(
        batches[i].map((task) => processor(task)),
      );

      results.push(...batchResults);
    }

    return results;
  }
}

export default BatchOperations;
