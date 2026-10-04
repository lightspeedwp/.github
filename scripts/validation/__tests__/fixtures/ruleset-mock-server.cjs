#!/usr/bin/env node
/**
 * Minimal stand-in for GET /repos/{owner}/{repo}/rulesets used by
 * validate-ruleset-drift tests.
 *
 * Runs in its own process because the test drives the validator with
 * spawnSync, which blocks the test process's event loop. If this server ran in
 * the test process it could never accept the request the child is waiting on.
 *
 * The rulesets to serve are read from MOCK_RULESETS. The chosen port is printed
 * on the first line of stdout so the test can read it back.
 */
const http = require('node:http');

const rulesets = JSON.parse(process.env.MOCK_RULESETS || '[]');

const server = http.createServer((req, res) => {
  if (req.url.includes('/rulesets')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rulesets));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end('{}');
});

server.listen(0, '127.0.0.1', () => {
  process.stdout.write(`${server.address().port}\n`);
});
