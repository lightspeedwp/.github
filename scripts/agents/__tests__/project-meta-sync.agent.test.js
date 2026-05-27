/**
 * Jest suite verifying the baseline behaviour of `project-meta-sync.agent.js`.
 * @see ../project-meta-sync.agent.js
 */
// Basic smoke test for project-meta-sync.agent.js
const agent = require('../project-meta-sync.agent');

describe('project-meta-sync.agent', () => {
  it('should be defined', () => {
    expect(agent).toBeDefined();
  });
});
