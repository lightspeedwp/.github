/**
 * Jest suite verifying the baseline behaviour of `mode-thinking.agent.js`.
 * @see ../mode-thinking.agent.js
 */
// Basic smoke test for mode-thinking.agent.js
const agent = require('../mode-thinking.agent');

describe('mode-thinking.agent', () => {
  it('should be defined', () => {
    expect(agent).toBeDefined();
  });
});
