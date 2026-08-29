class WorkflowsAPI {
  constructor(client, options = {}) {
    if (!client?.actions) {
      throw new Error("Octokit client with actions scope is required");
    }

    this.client = client;
    this.retryStrategy = options.retryStrategy || null;
    this.fallbackHandler = options.fallbackHandler || null;
  }

  async _execute(requestFn, operation, fallbackValue) {
    try {
      if (this.retryStrategy?.execute) {
        return await this.retryStrategy.execute(requestFn, operation);
      }

      return await requestFn();
    } catch (error) {
      if (typeof this.fallbackHandler === "function") {
        const fallbackResult = await this.fallbackHandler({
          module: "workflows",
          operation,
          error,
        });

        if (fallbackResult !== undefined) {
          return fallbackResult;
        }
      }

      if (fallbackValue !== undefined) {
        return fallbackValue;
      }

      throw new Error(`Failed to ${operation}: ${error.message}`, {
        cause: error,
      });
    }
  }

  async getWorkflows(options = {}) {
    const { owner, repo, perPage = 30, fallback = undefined } = options;

    if (!owner || !repo) {
      throw new Error("owner and repo are required");
    }

    const response = await this._execute(
      () =>
        this.client.actions.listRepoWorkflows({
          owner,
          repo,
          per_page: perPage,
        }),
      "fetch workflows",
      fallback,
    );

    const workflows = Array.isArray(response)
      ? response
      : response?.workflows || response?.data?.workflows || [];

    return workflows.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      state: workflow.state,
      path: workflow.path,
      url: workflow.html_url,
    }));
  }

  async getWorkflowRuns(options = {}) {
    const {
      owner,
      repo,
      workflowId = undefined,
      branch = undefined,
      perPage = 30,
      fallback = undefined,
    } = options;

    if (!owner || !repo) {
      throw new Error("owner and repo are required");
    }

    const response = await this._execute(
      () => {
        if (workflowId) {
          return this.client.actions.listWorkflowRuns({
            owner,
            repo,
            workflow_id: workflowId,
            branch,
            per_page: perPage,
          });
        }

        return this.client.actions.listWorkflowRunsForRepo({
          owner,
          repo,
          branch,
          per_page: perPage,
        });
      },
      "fetch workflow runs",
      fallback,
    );

    const runs = Array.isArray(response)
      ? response
      : response?.workflow_runs || response?.data?.workflow_runs || [];

    return runs.map((run) => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      branch: run.head_branch,
      url: run.html_url,
      createdAt: run.created_at,
    }));
  }
}

module.exports = WorkflowsAPI;
