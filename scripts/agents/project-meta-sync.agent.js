#!/usr/bin/env node
/**
 * project-meta-sync.js
 * GitHub Projects synchronization agent.
 *
 * This script is invoked by the project-meta-sync GitHub Actions workflow.
 * It adds the triggered issue or PR to the configured project (if not already added)
 * and updates the project's fields (Status, Priority, Type) based on labels and PR branch.
 * @module scripts/agents/project-meta-sync.agent.js
 * @see ../../agents/project-meta-sync.agent.md
 */

const { getOctokit } = require("@actions/github"); // if running in Actions context
const core = require("@actions/core"); // to get inputs/secrets

async function run() {
  try {
    // Inputs: assuming the workflow passes in necessary info via environment or file
    const projectUrl = process.env.LS_PROJECT_URL; // e.g. "https://github.com/orgs/LightSpeed/projects/1"
    if (!projectUrl) {
      throw new Error("LS_PROJECT_URL not set");
    }
    // Get GitHub context from env (if running within GitHub Actions, the GITHUB_EVENT_PATH has event payload)
    const githubToken =
      process.env.GITHUB_TOKEN || core.getInput("github-token");
    if (!githubToken) {
      throw new Error("GitHub token not available for project sync");
    }
    const octokit = getOctokit(githubToken);

    // Parse project org and number from URL
    const match = projectUrl.match(/orgs\/([^/]+)\/projects\/(\d+)/);
    if (!match) {
      throw new Error(`Invalid LS_PROJECT_URL format: ${projectUrl}`);
    }
    const orgLogin = match[1];
    const projectNumber = parseInt(match[2], 10);

    // Load event payload
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (!eventPath) {
      throw new Error("No GitHub event context found");
    }
    const event = require(eventPath);
    // Determine if this is issue or PR and get relevant info
    const isPR = !!event.pull_request;
    const isIssue = !!event.issue; // note: in PR events, event.issue may not exist
    const itemNodeId = isPR ? event.pull_request.node_id : event.issue.node_id;
    const itemNumber = isPR ? event.pull_request.number : event.issue.number;
    const repoOwner =
      (event.repository && event.repository.owner.login) || orgLogin;
    const repoName = event.repository && event.repository.name;

    // Fetch the project ID and field IDs via GraphQL
    const projectData = await octokit.graphql(
      `
      query($org: String!, $number: Int!) {
        organization(login: $org) {
          projectV2(number: $number) {
            id
            title
            fields(first: 20) {
              nodes {
                id
                name
                dataType
                ... on ProjectV2SingleSelectField {
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
      { org: orgLogin, number: projectNumber },
    );
    const project = projectData.organization.projectV2;
    const projectId = project.id;
    const fields = project.fields.nodes;
    // Helper: find field and option IDs by name
    const findField = (fname) => fields.find((f) => f.name === fname);
    const findOptionId = (fieldName, optionName) => {
      const field = findField(fieldName);
      if (!field || field.dataType !== "SINGLE_SELECT") return null;
      const opt = field.options.find(
        (o) => o.name.toLowerCase() === optionName.toLowerCase(),
      );
      return opt ? opt.id : null;
    };

    // Step 1: Add item to project (if not already added)
    // We attempt to add; if already exists, GitHub will error with "content already exists in project" which we can ignore.
    try {
      await octokit.graphql(
        `
        mutation($project: ID!, $item: ID!) {
          addProjectV2ItemById(input: {projectId: $project, contentId: $item}) {
            item {
              id
            }
          }
        }
      `,
        { project: projectId, item: itemNodeId },
      );
      console.log(`Added item ${itemNodeId} to project ${project.title}`);
    } catch (err) {
      if (err.message && err.message.includes("already exists")) {
        console.log(`Item ${itemNodeId} is already in project`);
      } else {
        throw err;
      }
    }

    // Step 2: Prepare field updates
    // Determine desired field values from labels and context
    let statusValue = null,
      priorityValue = null,
      typeValue = null;
    if (isPR) {
      // For PRs, branch prefix drives Type
      const headRef = event.pull_request.head.ref; // e.g. "feat/my-feature"
      if (headRef.match(/^feat\//i)) typeValue = "Feature";
      else if (headRef.match(/^fix\//i)) typeValue = "Bug";
      else if (headRef.match(/^docs?\//i)) typeValue = "Documentation";
      else if (headRef.match(/^chore\//i)) typeValue = "Task";
      // If PR is just opened, it should have 'needs-review' label per labeling workflow
      // If merged or closed:
      if (event.action === "closed") {
        statusValue = "Done";
      } else if (event.action === "opened" || event.action === "reopened") {
        statusValue = "In review"; // PRs start in review
      }
    } else if (isIssue) {
      if (event.action === "closed") {
        statusValue = "Done";
      } else if (event.action === "reopened") {
        statusValue = "Triage";
      }
      // For issues, infer type from labels if any (e.g., type: bug/feature)
    }
    // Labels can override or provide values
    const labels =
      (isPR ? event.pull_request.labels : event.issue.labels) || [];
    for (const label of labels) {
      const name = label.name;
      if (name.startsWith("status:")) {
        // Map status label to field value
        // e.g. "status:needs-triage" -> "Triage"
        //      "status:needs-review" -> "In review"
        //      "status:in-progress" -> "In progress"
        //      "status:Blocked" -> "Blocked"
        //      "status:Done" -> "Done"
        let statusName = name.replace(/^status:/, "");
        if (statusName.match(/^needs-/)) {
          statusName = statusName.replace(/^needs-/, "");
          // e.g. "needs-triage" -> "triage"
          // capitalize first letter of each word and add spaces if needed
        }
        statusName = statusName.replace(/-/g, " "); // "in-progress" -> "in progress"
        statusName = statusName.replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words
        statusValue = statusName;
      }
      if (name.startsWith("priority:")) {
        let prioName = name.replace(/^priority:/, "");
        prioName = prioName.charAt(0).toUpperCase() + prioName.slice(1); // capitalize first letter
        priorityValue = prioName;
      }
      if (name.startsWith("type:")) {
        // If an explicit type label is present, use it
        let typeName = name.replace(/^type:/, "");
        typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        typeValue = typeName;
      }
    }

    // Default statuses if still not set
    if (!statusValue) {
      if (isIssue && event.action === "opened") {
        statusValue = "Triage";
      }
    }
    console.log(
      `Determined field values -> Status: ${statusValue || "None"}, Priority: ${priorityValue || "None"}, Type: ${typeValue || "None"}`,
    );

    // Step 3: Update fields via mutations
    const updateField = async (fieldName, fieldValue) => {
      if (!fieldValue) return;
      const field = findField(fieldName);
      if (!field) {
        console.warn(
          `Field '${fieldName}' not found on project, skipping update.`,
        );
        return;
      }
      let fvInputs = {};
      if (field.dataType === "SINGLE_SELECT") {
        // need option ID
        const optId = findOptionId(fieldName, fieldValue);
        if (!optId) {
          console.warn(
            `Option '${fieldValue}' not found for field '${fieldName}', skipping update.`,
          );
          return;
        }
        fvInputs = { singleSelectOptionId: optId };
      } else {
        // for text fields or others
        fvInputs = { text: fieldValue };
      }
      await octokit.graphql(
        `
        mutation($project: ID!, $itemId: ID!, $fieldId: ID!, $fv: ProjectV2FieldValue!) {
          updateProjectV2ItemFieldValue(input: {
            projectId: $project,
            itemId: $itemId,
            fieldId: $fieldId,
            value: $fv
          }) {
            projectV2Item {
              id
            }
          }
        }
      `,
        {
          project: projectId,
          itemId: itemNodeId,
          fieldId: field.id,
          fv: fvInputs,
        },
      );
      console.log(`Updated '${fieldName}' field to '${fieldValue}'`);
    };

    // Update the fields we have values for
    await updateField("Status", statusValue);
    await updateField("Priority", priorityValue);
    await updateField("Type", typeValue);

    // Step 4: (Optional) Enforce single status label by removing others if a new status was applied
    if (statusValue) {
      // Remove any status: label that doesn't correspond to statusValue
      const statusLabelsToRemove = labels.filter(
        (l) =>
          l.name.startsWith("status:") &&
          !l.name.includes(statusValue.toLowerCase().replace(/ /g, "")),
      );
      for (const lbl of statusLabelsToRemove) {
        await octokit.rest.issues
          .removeLabel({
            owner: repoOwner,
            repo: repoName,
            issue_number: itemNumber,
            name: lbl.name,
          })
          .catch((err) => {
            console.warn(`Failed to remove label ${lbl.name}: ${err.message}`);
          });
      }
      if (statusLabelsToRemove.length) {
        console.log(
          `Removed obsolete status labels: ${statusLabelsToRemove.map((l) => l.name).join(", ")}`,
        );
      }
    }

    console.log("Project sync complete.");
  } catch (error) {
    console.error("Project sync failed:", error);
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
