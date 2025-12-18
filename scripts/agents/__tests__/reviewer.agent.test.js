/**
 * Jest suite verifying the baseline behaviour of `reviewer.agent.js`.
 * @see ../reviewer.agent.js
 */
// Basic smoke test for reviewer.agent.js
const agent = require('../reviewer.agent');

describe('reviewer.agent', () => {
  it('should be defined', () => {
    expect(agent).toBeDefined();
  });
});
