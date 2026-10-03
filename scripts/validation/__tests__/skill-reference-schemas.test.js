/**
 * Guards the hand-authored reference schemas shipped under skills/.
 *
 * intake-wizard-schema.yaml carried `claim_register` at the wrong indent
 * level, producing a duplicate key and making the whole document fail to parse
 * ("Map keys must be unique"). Re-indenting it fixed the parse but also changed
 * the parsed structure, so both facts are asserted here: the document parses,
 * and claim_register is nested under memory_schema rather than sitting at the
 * top level.
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const repositoryRoot = path.resolve(__dirname, '../../..');

const YAML_SCHEMAS = ['skills/project-onboarding/references/intake-wizard-schema.yaml'];
const JSON_SCHEMAS = [
  'skills/zendesk-backlog-trend-analysis/schemas/workspace-capability-profile.schema.json',
];

describe('skill reference schemas', () => {
  it.each(YAML_SCHEMAS)('%s parses as YAML', (relative) => {
    const raw = fs.readFileSync(path.join(repositoryRoot, relative), 'utf8');

    expect(() => yaml.load(raw)).not.toThrow();
  });

  it.each(JSON_SCHEMAS)('%s parses as JSON', (relative) => {
    const raw = fs.readFileSync(path.join(repositoryRoot, relative), 'utf8');

    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it('nests claim_register inside memory_schema', () => {
    const doc = yaml.load(fs.readFileSync(path.join(repositoryRoot, YAML_SCHEMAS[0]), 'utf8'));

    expect(Object.keys(doc)).toContain('memory_schema');
    expect(Object.keys(doc.memory_schema)).toContain('claim_register');
    // A top-level claim_register section also exists legitimately; the two are
    // distinct keys in different scopes, not a duplicate.
    expect(doc.memory_schema.claim_register).toBeDefined();
  });

  it('rejects a duplicate key in the same scope (the original defect)', () => {
    // The defect this guards: two `claim_register` keys at one indent level
    // make the whole document unparseable. js-yaml throws on that, which is
    // what makes the parse assertions above meaningful.
    expect(() => yaml.load('a: 1\nclaim_register: {}\nclaim_register: {}\n')).toThrow(
      /duplicated mapping key/
    );
  });
});
