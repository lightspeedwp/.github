#!/usr/bin/env node
/**
 * Validate .github/mergify.yml against Mergify's published JSON schema.
 *
 * Schema: https://docs.mergify.com/mergify-configuration-schema.json
 *
 * Wired as `npm run validate:mergify`. It is deliberately **not** one of the
 * steps in `npm run validate:all` and no workflow runs it, because it downloads
 * the schema over the network and every step in `validate:all` works offline.
 * That makes it a maintainer-run check: run it by hand after editing
 * `.github/mergify.yml`, or add it to a workflow that may reach the network.
 *
 * Pass a schema path as the first argument to validate against a local copy
 * instead of fetching.
 *
 * Usage:
 *   npm run validate:mergify
 *   node scripts/validation/validate-mergify-config.cjs /path/to/schema.json
 */
const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');

const SCHEMA_URL = 'https://docs.mergify.com/mergify-configuration-schema.json';
const repositoryRoot = path.resolve(__dirname, '../..');
const configPath = path.join(repositoryRoot, '.github/mergify.yml');

function fetchSchema(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`GET ${url} responded ${response.statusCode}`));
          response.resume();
          return;
        }
        response.setEncoding('utf8');
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

function buildValidator(schema) {
  // The published schema is JSON Schema 2020-12, which ajv exposes through a
  // separate entry point from the default draft-07 build.
  const Ajv2020 = require('ajv/dist/2020');
  // The published schema uses custom formats (`simple-template`, `regex`,
  // `template`, `duration`) that ajv does not implement. `logger: false` drops
  // ajv's "unknown format ignored" notices for those; they do not affect the
  // keywords this validation depends on.
  const ajv = new Ajv2020({ strict: false, allErrors: true, logger: false });
  return ajv.compile(schema);
}

function readConfig() {
  const YAML = require('yaml');
  return YAML.parse(fs.readFileSync(configPath, 'utf8'));
}

async function main() {
  const schemaPath = process.argv[2];
  const rawSchema = schemaPath
    ? fs.readFileSync(schemaPath, 'utf8')
    : await fetchSchema(SCHEMA_URL);
  const schema = JSON.parse(rawSchema);
  const validate = buildValidator(schema);

  const config = readConfig();
  const valid = validate(config);

  console.log(`schema: ${schemaPath || SCHEMA_URL}`);
  console.log(`config: ${path.relative(repositoryRoot, configPath)}`);
  console.log(`result: ${valid ? 'valid' : 'INVALID'}`);

  if (!valid) {
    for (const error of validate.errors || []) {
      console.error(`  ${error.instancePath || '/'} ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`top-level keys: ${Object.keys(config).join(', ') || '(none)'}`);
}

module.exports = { buildValidator, readConfig, configPath, SCHEMA_URL };

if (require.main === module) {
  main().catch((error) => {
    console.error(`validate-mergify-config: ${error.message}`);
    process.exitCode = 1;
  });
}
