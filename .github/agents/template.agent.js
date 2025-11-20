/**
 * template.agent.js
 * Generic agent template stub used by tests and as a scaffold for new agents.
 */

/**
 * Example implementation function.
 * @param {object} ctx
 * @returns {{ok: boolean, timestamp: string}}
 */
function runAgent(ctx = {}) {
    return { ok: true, timestamp: new Date().toISOString(), ctx }; // minimal payload
}

module.exports = { runAgent };
