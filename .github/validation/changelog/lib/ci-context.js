class CIContext {
  constructor(env = process.env) {
    this.env = env;
    this.context = this.detectContext();
  }

  detectContext() {
    if (this.isGitHubActions()) {
      return this.getGitHubActionsContext();
    }

    if (this.isCircleCI()) {
      return this.getCircleCIContext();
    }

    if (this.isTravisCI()) {
      return this.getTravisCIContext();
    }

    return this.getLocalContext();
  }

  isGitHubActions() {
    return this.env.GITHUB_ACTIONS === 'true' || this.env.CI === 'true';
  }

  isCircleCI() {
    return this.env.CIRCLECI === 'true';
  }

  isTravisCI() {
    return this.env.TRAVIS === 'true';
  }

  getGitHubActionsContext() {
    const eventName = this.env.GITHUB_EVENT_NAME || 'unknown';
    const eventPath = this.env.GITHUB_EVENT_PATH;
    let eventData = {};

    if (eventPath) {
      try {
        const fs = require('fs');
        eventData = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
      } catch (error) {
        console.warn('Failed to read GitHub event data:', error.message);
      }
    }

    return {
      ci: 'github-actions',
      event: eventName,
      branch: this.env.GITHUB_REF_NAME || this.getBranchFromRef(this.env.GITHUB_REF),
      commit: this.env.GITHUB_SHA || '',
      repo: this.env.GITHUB_REPOSITORY || '',
      actor: this.env.GITHUB_ACTOR || '',
      pr_number: this.getPRNumberFromEvent(eventName, eventData),
      pr_title: eventData?.pull_request?.title || null,
      pr_body: eventData?.pull_request?.body || null,
      base_branch: eventData?.pull_request?.base?.ref || null,
      head_branch: eventData?.pull_request?.head?.ref || null,
      action: eventData?.action || null,
      workflow: this.env.GITHUB_WORKFLOW || '',
      run_id: this.env.GITHUB_RUN_ID || '',
      job: this.env.GITHUB_JOB || '',
      server_url: this.env.GITHUB_SERVER_URL || 'https://github.com',
      api_url: this.env.GITHUB_API_URL || 'https://api.github.com',
      raw_event_data: eventData,
    };
  }

  getCircleCIContext() {
    return {
      ci: 'circleci',
      branch: this.env.CIRCLE_BRANCH || '',
      commit: this.env.CIRCLE_SHA1 || '',
      repo: this.env.CIRCLE_REPOSITORY_URL || '',
      pr_number: this.env.CIRCLE_PULL_REQUEST
        ? parseInt(this.env.CIRCLE_PULL_REQUEST.split('/').pop())
        : null,
      job: this.env.CIRCLE_JOB || '',
      build_num: this.env.CIRCLE_BUILD_NUM || '',
    };
  }

  getTravisCIContext() {
    return {
      ci: 'travis',
      branch: this.env.TRAVIS_BRANCH || '',
      commit: this.env.TRAVIS_COMMIT || '',
      repo: this.env.TRAVIS_REPO_SLUG || '',
      pr_number:
        this.env.TRAVIS_PULL_REQUEST !== 'false' ? parseInt(this.env.TRAVIS_PULL_REQUEST) : null,
      job_id: this.env.TRAVIS_JOB_ID || '',
      build_id: this.env.TRAVIS_BUILD_ID || '',
    };
  }

  getLocalContext() {
    return {
      ci: 'local',
      branch: this.env.BRANCH || this.env.GIT_BRANCH || 'unknown',
      commit: this.env.COMMIT || this.env.GIT_COMMIT || '',
      repo: this.env.REPO || '',
      pr_number: null,
    };
  }

  getBranchFromRef(ref) {
    if (!ref) return '';
    if (ref.startsWith('refs/heads/')) {
      return ref.replace('refs/heads/', '');
    }
    if (ref.startsWith('refs/pull/')) {
      return ref.replace('refs/pull/', '').replace('/merge', '');
    }
    return ref;
  }

  getPRNumberFromEvent(eventName, eventData) {
    if (eventName === 'pull_request' || eventName === 'pull_request_target') {
      return eventData?.pull_request?.number || null;
    }
    return null;
  }

  isCIPullRequest() {
    return this.context.pr_number !== null;
  }

  isPullRequest() {
    return this.isCIPullRequest() || this.env.GITHUB_EVENT_NAME === 'pull_request';
  }

  isPushEvent() {
    return this.env.GITHUB_EVENT_NAME === 'push' || this.context.ci === 'local';
  }

  isScheduledEvent() {
    return this.env.GITHUB_EVENT_NAME === 'schedule';
  }

  getContext() {
    return this.context;
  }

  getSummary() {
    const ctx = this.context;
    return {
      ci_system: ctx.ci,
      branch: ctx.branch,
      is_pr: this.isPullRequest(),
      pr_number: ctx.pr_number,
      commit: ctx.commit?.substring(0, 7),
      repo: ctx.repo,
      event: ctx.event || 'unknown',
    };
  }

  getGitHubToken() {
    return this.env.GITHUB_TOKEN || this.env.GH_TOKEN || this.env.PERSONAL_GITHUB_TOKEN || null;
  }

  getAPIHeaders() {
    const token = this.getGitHubToken();

    if (!token) {
      return {
        Accept: 'application/vnd.github.v3+json',
      };
    }

    return {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'LightSpeed-Changelog-Validator',
    };
  }

  getValidationTrigger() {
    if (this.isPullRequest()) {
      return 'pr_submission';
    }

    if (this.isScheduledEvent()) {
      return 'scheduled_audit';
    }

    return 'manual';
  }

  shouldValidateChangelog() {
    if (this.context.ci === 'local') {
      return true;
    }

    const changedFiles = this.getChangedFiles();
    const hasChangelogChanges = changedFiles.some(
      (file) =>
        file.includes('CHANGELOG.md') ||
        file.includes('changelog') ||
        file.includes('.github/validation/changelog')
    );

    return hasChangelogChanges;
  }

  getChangedFiles() {
    const eventData = this.context.raw_event_data || {};

    if (eventData.pull_request) {
      return (eventData.pull_request.changed_files || []).map((f) => f.filename || f);
    }

    if (eventData.commits) {
      const files = new Set();
      for (const commit of eventData.commits) {
        if (commit.modified) commit.modified.forEach((f) => files.add(f));
        if (commit.added) commit.added.forEach((f) => files.add(f));
      }
      return Array.from(files);
    }

    return [];
  }

  validateRequiredVariables() {
    const errors = [];

    if (!this.getGitHubToken() && this.context.ci === 'github-actions') {
      errors.push('GITHUB_TOKEN environment variable not found');
    }

    if (this.isPullRequest() && !this.context.pr_number) {
      errors.push('PR number could not be determined');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default CIContext;
