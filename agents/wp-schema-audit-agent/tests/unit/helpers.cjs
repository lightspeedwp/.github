/**
 * Shared helpers for the schema-tool tests: the vocabulary fixture, a page
 * builder and a fetch stub, so no test touches the network.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { buildVocabulary } = require('../../lib/schema-tool.cjs');

const FIXTURES = path.join(__dirname, '..', 'fixtures');
const VOCAB_FILE = path.join(FIXTURES, 'vocab-mini.jsonld');

function loadVocab() {
  return buildVocabulary(JSON.parse(fs.readFileSync(VOCAB_FILE, 'utf8')), 'fixture');
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'schema-tool-'));
}

/** HTML page holding each value as a JSON-LD block; strings are used verbatim. */
function page(blocks, { className = '', extraHead = '' } = {}) {
  const tags = blocks.map((b) => {
    const json = typeof b === 'string' ? b : JSON.stringify(b);
    const cls = className ? ` class="${className}"` : '';
    return `<script type="application/ld+json"${cls}>${json}</script>`;
  });
  return `<!doctype html><html><head>${extraHead}${tags.join('')}</head><body></body></html>`;
}

/** Turn validateBlocks()-style input from plain objects. */
function blocksOf(...docs) {
  return docs.map((data, index) => ({ index, className: '', data, error: null }));
}

/**
 * Fetch stub. `routes` maps a URL to a response, or to a function returning
 * one. Unknown URLs answer 404. Responses may set `redirectTo` to simulate a
 * followed redirect.
 */
function stubFetch(routes) {
  const calls = [];
  const fetch = async (url) => {
    calls.push(url);
    let res = routes[url];
    if (typeof res === 'function') res = res(url);
    if (!res) return { status: 404, url, redirects: [], body: '' };
    if (res instanceof Error) throw res;
    const body = typeof res.body === 'string' ? res.body : JSON.stringify(res.body ?? '');
    if (res.redirectTo) {
      return {
        status: res.status ?? 200,
        url: res.redirectTo,
        redirects: [{ status: 301, from: url, to: res.redirectTo }],
        body,
      };
    }
    return { status: res.status ?? 200, url, redirects: [], body };
  };
  fetch.calls = calls;
  return fetch;
}

/** Findings reduced to `severity check` strings, for compact assertions. */
function checks(findings) {
  return findings.map((f) => `${f.severity} ${f.check}`);
}

module.exports = { FIXTURES, VOCAB_FILE, loadVocab, tempDir, page, blocksOf, stubFetch, checks };
