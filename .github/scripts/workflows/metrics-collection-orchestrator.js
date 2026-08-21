#!/usr/bin/env node

/**
 * Metrics Collection Orchestrator
 * Coordinates metrics collection across multiple repositories
 * Handles GitHub API interactions, storage, and error recovery
 */

const fs = require('fs');
const path = require('path');
const { GitHubAPIClient } = require('../../scripts/metrics/metrics-agent');
const { MetricsStorage } = require('../../scripts/metrics/metrics-storage');
const { TrendAnalyzer } = require('../../scripts/metrics/trend-analyzer');
const { AnomalyDetector } = require('../../scripts/metrics/anomaly-detector');

class MetricsCollectionOrchestrator {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = this.loadConfig();
    this.storage = new MetricsStorage(this.config.storage.basePath);
    this.trendAnalyzer = new TrendAnalyzer();
    this.anomalyDetector = new AnomalyDetector();
    this.results = [];
    this.errors = [];
  }

  loadConfig() {
    if (!fs.existsSync(this.configPath)) {
      throw new Error(`Configuration file not found: ${this.configPath}`);
    }

    const configContent = fs.readFileSync(this.configPath, 'utf8');
    const config = JSON.parse(configContent);

    if (!config.repositories || config.repositories.length === 0) {
      throw new Error('No repositories configured for metrics collection');
    }

    return config;
  }

  async collectMetricsForRepository(repo) {
    const startTime = Date.now();
    const repositoryKey = `${repo.owner}/${repo.repo}`;

    try {
      console.log(`\n📊 Collecting metrics for ${repositoryKey}...`);

      const client = new GitHubAPIClient({
        owner: repo.owner,
        repo: repo.repo,
        token: process.env.GITHUB_TOKEN,
      });

      // Fetch metrics from GitHub API
      const metrics = await client.fetchMetrics();

      if (!metrics) {
        throw new Error(`Failed to fetch metrics for ${repositoryKey}`);
      }

      // Add repository and timestamp information
      const enrichedMetrics = {
        ...metrics,
        repository: repositoryKey,
        context: repo.context,
        timestamp: new Date().toISOString(),
        collectionTime: Date.now() - startTime,
      };

      // Store metrics
      await this.storage.saveMetrics(repositoryKey, enrichedMetrics);

      // Analyze trends
      const trends = await this.trendAnalyzer.analyzeTrends(
        repositoryKey,
        this.storage
      );

      // Detect anomalies
      const anomalies = await this.anomalyDetector.detectAnomalies(
        repositoryKey,
        enrichedMetrics,
        trends
      );

      const result = {
        repository: repositoryKey,
        status: 'success',
        metricsCount: Object.keys(metrics).length,
        timestamp: enrichedMetrics.timestamp,
        collectionTime: enrichedMetrics.collectionTime,
        anomalies: anomalies.length,
        trends: Object.keys(trends).length,
      };

      this.results.push(result);
      console.log(`✅ Successfully collected metrics for ${repositoryKey}`);
      console.log(`   Metrics: ${result.metricsCount} | Anomalies: ${result.anomalies}`);

      return result;
    } catch (error) {
      const errorResult = {
        repository: repositoryKey,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };

      this.errors.push(errorResult);
      console.error(`❌ Error collecting metrics for ${repositoryKey}:`, error.message);

      return errorResult;
    }
  }

  async orchestrateCollection() {
    console.log('\n🚀 Starting metrics collection...');
    console.log(`📋 Repositories to process: ${this.config.repositories.length}`);
    console.log(`⚙️  Parallel jobs: ${this.config.execution.parallelJobs}`);

    const enabledRepos = this.config.repositories.filter((repo) => repo.enabled !== false);

    if (enabledRepos.length === 0) {
      console.warn('⚠️  No enabled repositories found in configuration');
      return this.generateSummary();
    }

    // Process repositories sequentially or in parallel based on configuration
    if (this.config.execution.parallelJobs === 1) {
      // Sequential processing
      for (const repo of enabledRepos) {
        await this.collectMetricsForRepository(repo);
      }
    } else {
      // Parallel processing
      const batchSize = this.config.execution.parallelJobs;
      for (let i = 0; i < enabledRepos.length; i += batchSize) {
        const batch = enabledRepos.slice(i, i + batchSize);
        await Promise.all(batch.map((repo) => this.collectMetricsForRepository(repo)));
      }
    }

    return this.generateSummary();
  }

  generateSummary() {
    const successCount = this.results.filter((r) => r.status === 'success').length;
    const errorCount = this.errors.length;
    const totalCount = successCount + errorCount;

    const summary = {
      timestamp: new Date().toISOString(),
      execution: {
        startTime: this.startTime,
        duration: Date.now() - this.startTime,
        repositories: {
          total: totalCount,
          successful: successCount,
          failed: errorCount,
          percentage: totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(2) : 0,
        },
      },
      results: this.results,
      errors: this.errors,
      config: {
        schedule: this.config.schedule.cron,
        parallelJobs: this.config.execution.parallelJobs,
        storagePath: this.config.storage.basePath,
      },
    };

    // Save summary report
    const summaryPath = path.join(
      this.config.storage.basePath,
      `collection-summary-${new Date().toISOString().split('T')[0]}.json`
    );
    fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log('\n📈 Collection Summary');
    console.log(`✅ Successful: ${successCount}/${totalCount}`);
    console.log(`❌ Failed: ${errorCount}/${totalCount}`);
    console.log(`⏱️  Duration: ${(summary.execution.duration / 1000).toFixed(2)}s`);
    console.log(`💾 Summary saved to: ${summaryPath}`);

    // Return exit code based on success rate
    if (errorCount > 0 && errorCount === totalCount) {
      process.exit(1);
    }

    return summary;
  }

  async run() {
    this.startTime = Date.now();
    try {
      const summary = await this.orchestrateCollection();
      console.log('\n✨ Metrics collection completed successfully');
      return summary;
    } catch (error) {
      console.error('\n💥 Fatal error during metrics collection:', error.message);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const context = args.includes('--context') 
    ? args[args.indexOf('--context') + 1] 
    : 'github-control-plane';
  const dryRun = args.includes('--dryRun') && args[args.indexOf('--dryRun') + 1] === 'true';

  const configPath = path.join(__dirname, `metrics-config.json`);

  console.log(`🔧 Configuration: ${configPath}`);
  console.log(`📦 Context: ${context}`);
  console.log(`🧪 Dry run: ${dryRun}`);

  const orchestrator = new MetricsCollectionOrchestrator(configPath);
  await orchestrator.run();

  // In dry-run mode, report but don't commit
  if (dryRun) {
    console.log('\n🧪 DRY RUN MODE - No changes were persisted');
  } else {
    console.log('\n💾 Results ready for commit');
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

module.exports = { MetricsCollectionOrchestrator };
