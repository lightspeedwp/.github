#!/usr/bin/env node
/**
 * Minimal stand-in for the GitHub rulesets API used by validate-ruleset-drift
 * tests.
 *
 * It deliberately reproduces the real API's two-step shape:
 *
 *   GET /repos/{o}/{r}/rulesets      -> summaries WITHOUT rules/conditions
 *   GET /repos/{o}/{r}/rulesets/{id} -> the full ruleset definition
 *
 * That distinction is the whole point. The list endpoint omits `rules` and
 * `conditions`, so a validator that compares against the list shape sees every
 * live field as empty and reports total drift on every run. Reproducing it here
 * keeps that regression caught.
 *
 * Runs in its own process because the test drives the validator with spawnSync,
 * which blocks the test process's event loop; an in-process server would never
 * accept the request the child is waiting on.
 *
 * Rulesets to serve come from MOCK_RULESETS (a JSON array of full rulesets).
 * The chosen port is printed on the first line of stdout for the test to read.
 */
const http = require('node:http');

const rulesets = JSON.parse(process.env.MOCK_RULESETS || '[]');

/** Strip the fields the real list endpoint omits. */
function toSummary(ruleset) {
  const { rules, conditions, ...rest } = ruleset;
  return rest;
}

function matchesId(url, ruleset) {
  const match = /\/rulesets\/(\d+)(?:$|\?)/.exec(url);
  return Boolean(match) && String(ruleset.id) === match[1];
}

// Files that exist on the `develop` branch (MOCK_FILES_ON_DEVELOP, a JSON array of
// repository paths). GET /repos/{o}/{r}/contents/{path}?ref=develop answers 200 for
// these and 404 for anything else, as the real contents API does.
const filesOnDevelop = JSON.parse(process.env.MOCK_FILES_ON_DEVELOP || '[]');

const server = http.createServer((req, res) => {
  const contents = /\/contents\/([^?]+)/.exec(req.url);
  if (contents) {
    const found = filesOnDevelop.includes(decodeURIComponent(contents[1]));
    res.writeHead(found ? 200 : 404, { 'Content-Type': 'application/json' });
    res.end(found ? JSON.stringify({ type: 'file' }) : '{"message":"Not Found"}');
    return;
  }

  if (!req.url.includes('/rulesets')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end('{}');
    return;
  }

  const byId = rulesets.find((ruleset) => matchesId(req.url, ruleset));

  if (byId) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(byId));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(rulesets.map(toSummary)));
});

server.listen(0, '127.0.0.1', () => {
  process.stdout.write(`${server.address().port}\n`);
});
