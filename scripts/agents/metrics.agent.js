/**
 * Metrics agent helpers for collecting, aggregating, and reporting repository health metrics.
 * The module is deliberately pure so it can be covered by unit tests without GitHub API calls.
 *
 * @module scripts/agents/metrics.agent.js
 * @see ../../../.github/agents/metrics.agent.md
 */

function normaliseDate(value) {
  if (!value) {
    return null;
  }

  const date =
    value instanceof Date ? new Date(value.getTime()) : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = normaliseDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

function formatDateTime(value) {
  const date = normaliseDate(value);
  return date ? date.toISOString() : "";
}

function diffHours(start, end) {
  const startDate = normaliseDate(start);
  const endDate = normaliseDate(end);

  if (!startDate || !endDate) {
    return null;
  }

  return Number(((endDate.getTime() - startDate.getTime()) / 36e5).toFixed(2));
}

function diffDays(start, end) {
  const hours = diffHours(start, end);
  return hours === null ? null : Number((hours / 24).toFixed(2));
}

function isWithinRange(value, start, end) {
  const date = normaliseDate(value);
  const startDate = normaliseDate(start);
  const endDate = normaliseDate(end);

  if (!date) {
    return false;
  }

  if (startDate && date < startDate) {
    return false;
  }

  if (endDate && date > endDate) {
    return false;
  }

  return true;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function average(values) {
  return values.length === 0
    ? 0
    : Number(
        (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
          2,
        ),
      );
}

function coerceLabelName(label) {
  if (!label) {
    return "";
  }

  if (typeof label === "string") {
    return label;
  }

  if (typeof label === "object" && typeof label.name === "string") {
    return label.name;
  }

  return "";
}

function earliestDate(values) {
  const dates = values.map(normaliseDate).filter(Boolean);

  if (dates.length === 0) {
    return null;
  }

  return dates.reduce((earliest, current) =>
    current < earliest ? current : earliest,
  );
}

function collectIssueMetrics(issues = [], options = {}) {
  if (!Array.isArray(issues)) {
    throw new TypeError("issues must be an array");
  }

  const now = normaliseDate(options.now) || new Date();
  const filteredIssues = issues.filter((issue) =>
    isWithinRange(
      issue?.createdAt || issue?.created_at,
      options.startDate,
      options.endDate,
    ),
  );

  const statusCounts = {};
  const labelCounts = {};
  const ageDays = [];
  const firstResponseHours = [];

  for (const issue of filteredIssues) {
    const state = String(issue?.state || "unknown").toLowerCase();
    statusCounts[state] = (statusCounts[state] || 0) + 1;

    const createdAt = issue?.createdAt || issue?.created_at;
    const closedAt = issue?.closedAt || issue?.closed_at;
    const firstResponseAt =
      issue?.firstResponseAt ||
      issue?.first_response_at ||
      earliestDate(
        safeArray(issue?.comments).map(
          (comment) => comment?.createdAt || comment?.created_at,
        ),
      );

    const age = diffDays(createdAt, closedAt || now);
    if (age !== null) {
      ageDays.push(age);
    }

    const responseHours = diffHours(createdAt, firstResponseAt);
    if (responseHours !== null) {
      firstResponseHours.push(responseHours);
    }

    for (const label of safeArray(issue?.labels).map(coerceLabelName)) {
      if (!label) {
        continue;
      }

      labelCounts[label] = (labelCounts[label] || 0) + 1;
    }
  }

  const average = (values) =>
    values.length === 0
      ? 0
      : Number(
          (
            values.reduce((sum, value) => sum + value, 0) / values.length
          ).toFixed(2),
        );

  return {
    total: filteredIssues.length,
    open: statusCounts.open || 0,
    closed: statusCounts.closed || 0,
    statusCounts,
    labelCounts,
    ageDaysSamples: ageDays,
    firstResponseHoursSamples: firstResponseHours,
    averageAgeDays: average(ageDays),
    averageFirstResponseHours: average(firstResponseHours),
  };
}

function collectPullRequestMetrics(pullRequests = [], options = {}) {
  if (!Array.isArray(pullRequests)) {
    throw new TypeError("pullRequests must be an array");
  }

  const now = normaliseDate(options.now) || new Date();
  const filteredPullRequests = pullRequests.filter((pullRequest) =>
    isWithinRange(
      pullRequest?.createdAt || pullRequest?.created_at,
      options.startDate,
      options.endDate,
    ),
  );

  const stateCounts = {};
  const mergedPullRequests = [];
  const reviewLeadHours = [];
  const leadTimeHours = [];

  for (const pullRequest of filteredPullRequests) {
    const state = String(pullRequest?.state || "unknown").toLowerCase();
    stateCounts[state] = (stateCounts[state] || 0) + 1;

    const createdAt = pullRequest?.createdAt || pullRequest?.created_at;
    const mergedAt = pullRequest?.mergedAt || pullRequest?.merged_at;
    const closedAt = pullRequest?.closedAt || pullRequest?.closed_at;
    const firstReviewAt =
      pullRequest?.firstReviewAt ||
      pullRequest?.first_review_at ||
      earliestDate(
        safeArray(pullRequest?.reviews).map(
          (review) => review?.submittedAt || review?.submitted_at,
        ),
      );

    if (mergedAt) {
      mergedPullRequests.push(pullRequest);
    }

    const reviewHours = diffHours(createdAt, firstReviewAt);
    if (reviewHours !== null) {
      reviewLeadHours.push(reviewHours);
    }

    const endPoint = mergedAt || closedAt || now;
    const leadTime = diffHours(createdAt, endPoint);
    if (leadTime !== null) {
      leadTimeHours.push(leadTime);
    }
  }

  const average = (values) =>
    values.length === 0
      ? 0
      : Number(
          (
            values.reduce((sum, value) => sum + value, 0) / values.length
          ).toFixed(2),
        );

  const total = filteredPullRequests.length;
  const merged = mergedPullRequests.length;

  return {
    total,
    merged,
    open: stateCounts.open || 0,
    closed: stateCounts.closed || 0,
    mergeRate: total === 0 ? 0 : Number(((merged / total) * 100).toFixed(2)),
    stateCounts,
    reviewLeadHoursSamples: reviewLeadHours,
    leadTimeHoursSamples: leadTimeHours,
    averageReviewLeadHours: average(reviewLeadHours),
    averageLeadTimeHours: average(leadTimeHours),
  };
}

function normaliseRepositories(repositories = []) {
  if (Array.isArray(repositories)) {
    return repositories;
  }

  if (repositories && typeof repositories === "object") {
    return Object.entries(repositories).map(([name, value]) => ({
      name,
      ...value,
    }));
  }

  throw new TypeError("repositories must be an array or object map");
}

function aggregateRepositoryMetrics(repositories = [], options = {}) {
  const repoList = normaliseRepositories(repositories);
  const perRepository = repoList.map((repository) => {
    const issues = collectIssueMetrics(repository?.issues || [], options);
    const pullRequests = collectPullRequestMetrics(
      repository?.pullRequests || [],
      options,
    );

    return {
      name: repository?.name || repository?.repository || "unknown",
      issues,
      pullRequests,
    };
  });

  const issueTotals = perRepository.reduce(
    (sum, repository) => sum + repository.issues.total,
    0,
  );
  const issueAgeDays = perRepository.flatMap(
    (repository) => repository.issues.ageDaysSamples,
  );
  const issueFirstResponseHours = perRepository.flatMap(
    (repository) => repository.issues.firstResponseHoursSamples,
  );
  const prTotals = perRepository.reduce(
    (sum, repository) => sum + repository.pullRequests.total,
    0,
  );
  const prMerged = perRepository.reduce(
    (sum, repository) => sum + repository.pullRequests.merged,
    0,
  );
  const prLeadTimes = perRepository.flatMap(
    (repository) => repository.pullRequests.leadTimeHoursSamples,
  );

  return {
    repositories: perRepository,
    summary: {
      repositoryCount: perRepository.length,
      issueCount: issueTotals,
      pullRequestCount: prTotals,
      mergedPullRequestCount: prMerged,
      mergeRate:
        prTotals === 0 ? 0 : Number(((prMerged / prTotals) * 100).toFixed(2)),
      averageIssueAgeDays: average(issueAgeDays),
      averageIssueFirstResponseHours: average(issueFirstResponseHours),
      averagePullRequestLeadTimeHours: average(prLeadTimes),
    },
  };
}

function generateMarkdownReport(report) {
  const generatedAt = formatDateTime(report.generatedAt || new Date());
  const summary = report.summary || {};
  const rows = safeArray(report.repositories);

  const repositoryTable =
    rows.length === 0
      ? "_No repository data available._"
      : [
          "| Repository | Issues | PRs | Merged PRs | Merge Rate | Avg issue first response (h) |",
          "| --- | ---: | ---: | ---: | ---: | ---: |",
          ...rows.map(
            (repository) =>
              `| ${repository?.name || "unknown"} | ${repository?.issues?.total ?? 0} | ${repository?.pullRequests?.total ?? 0} | ${repository?.pullRequests?.merged ?? 0} | ${repository?.pullRequests?.mergeRate ?? 0}% | ${repository?.issues?.averageFirstResponseHours ?? 0} |`,
          ),
        ].join("\n");

  return `# Metrics Report

Generated: ${generatedAt}

## Summary

- Repositories: ${summary.repositoryCount || 0}
- Issues: ${summary.issueCount || 0}
- Pull requests: ${summary.pullRequestCount || 0}
- Merged pull requests: ${summary.mergedPullRequestCount || 0}
- Merge rate: ${summary.mergeRate || 0}%
- Average issue first response: ${summary.averageIssueFirstResponseHours || 0}h
- Average PR lead time: ${summary.averagePullRequestLeadTimeHours || 0}h

## Repository Breakdown

${repositoryTable}
`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[,"\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function generateCsvReport(report) {
  const rows = safeArray(report.repositories);
  const lines = [
    [
      "repository",
      "issue_count",
      "open_issues",
      "closed_issues",
      "pr_count",
      "merged_prs",
      "merge_rate",
      "issue_first_response_hours",
      "pr_lead_time_hours",
    ].join(","),
  ];

  for (const repository of rows) {
    lines.push(
      [
        repository?.name || "unknown",
        repository?.issues?.total ?? 0,
        repository?.issues?.open ?? 0,
        repository?.issues?.closed ?? 0,
        repository?.pullRequests?.total ?? 0,
        repository?.pullRequests?.merged ?? 0,
        repository?.pullRequests?.mergeRate ?? 0,
        repository?.issues?.averageFirstResponseHours ?? 0,
        repository?.pullRequests?.averageLeadTimeHours ?? 0,
      ]
        .map(csvEscape)
        .join(","),
    );
  }

  return lines.join("\n");
}

function createReport(repositories, options = {}) {
  const metrics = aggregateRepositoryMetrics(repositories, options);

  return {
    ...metrics,
    generatedAt: options.generatedAt || new Date(),
    markdown: generateMarkdownReport({
      ...metrics,
      generatedAt: options.generatedAt || new Date(),
    }),
    csv: generateCsvReport(metrics),
  };
}

module.exports = {
  aggregateRepositoryMetrics,
  collectIssueMetrics,
  collectPullRequestMetrics,
  createReport,
  diffDays,
  diffHours,
  formatDate,
  formatDateTime,
  generateCsvReport,
  generateMarkdownReport,
  isWithinRange,
  normaliseDate,
};
