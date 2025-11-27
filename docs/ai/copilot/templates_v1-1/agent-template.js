/*
 * Agent Template Stub
 *
 * This file provides a minimal skeleton for creating a custom Copilot agent.
 * Fill in the TODO sections with the logic specific to your agent.
 */

// Import any required SDKs or helper libraries. For example, the Copilot SDK:
// const { Agent, ToolRegistry } = require('@github/copilot-sdk');

// TODO: Register connectors and tools that your agent will use.
// Example:
// const toolRegistry = new ToolRegistry();
// toolRegistry.register('github', githubConnector);
// toolRegistry.register('googleDrive', driveConnector);

// TODO: Define the agent’s configuration, including name, description and instruction loading.
const agentConfig = {
  name: "my-custom-agent",
  description: "An agent that performs multi-step tasks according to a plan.",
  // instructionsFile: './instructions/my-agent.instructions.md',
  // model: 'gpt-5-pro', // or choose based on task requirements
};

// TODO: Implement the agent’s main function. This function receives inputs from the user
// and orchestrates the execution of tasks using registered tools.
async function runAgent(input) {
  // Parse input (objective, tasks, options)
  // Plan the sequence of actions
  // For each action:
  //   - Call the appropriate tool
  //   - Handle errors
  //   - Update progress
  // Return a final summary of actions taken
  console.log("Agent started with input:", input);
  // Example placeholder response
  return {
    status: "success",
    summary: "Agent completed the task plan successfully.",
    artifacts: [],
  };
}

// Expose the agent for use by Copilot runtime or testing harness.
module.exports = { runAgent, agentConfig };
