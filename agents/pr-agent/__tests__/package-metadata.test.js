/**
 * @jest-environment node
 */
import { readFileSync } from 'node:fs';

import { describe, expect, it } from '@jest/globals';

const readJson = (relativePath) =>
  JSON.parse(readFileSync(new URL(relativePath, import.meta.url), 'utf8'));

const packageJson = readJson('../package.json');
const packageLock = readJson('../package-lock.json');
const majorVersion = (range) => Number(range.match(/\d+/u)[0]);

describe('PR agent package metadata', () => {
  it('identifies the package and repository directory as pr-agent', () => {
    expect(packageJson).toMatchObject({
      name: '@lightspeedwp/pr-agent',
      repository: {
        type: 'git',
        url: 'https://github.com/lightspeedwp/.github.git',
        directory: 'agents/pr-agent',
      },
      keywords: expect.arrayContaining(['agent', 'pr-agent', 'github']),
    });
  });

  it('does not advertise a package entry point that does not exist', () => {
    expect(packageJson).not.toHaveProperty('main');
  });

  it('declares a compatible ESLint flat-config toolchain', () => {
    const dependencies = packageJson.devDependencies;

    expect(dependencies).toEqual(
      expect.objectContaining({
        eslint: expect.any(String),
        '@eslint/js': expect.any(String),
        globals: expect.any(String),
      })
    );
    expect(majorVersion(dependencies.eslint)).toBe(majorVersion(dependencies['@eslint/js']));
  });

  it('declares compatible Jest and Babel dependency families', () => {
    const dependencies = packageJson.devDependencies;

    expect(majorVersion(dependencies.jest)).toBe(majorVersion(dependencies['@jest/globals']));
    expect(majorVersion(dependencies.jest)).toBe(majorVersion(dependencies['babel-jest']));
    expect(majorVersion(dependencies['@babel/core'])).toBe(
      majorVersion(dependencies['@babel/preset-env'])
    );
  });

  it('keeps the lockfile root metadata in sync with package.json', () => {
    expect(packageLock).toMatchObject({
      name: packageJson.name,
      version: packageJson.version,
      lockfileVersion: 3,
    });
    expect(packageLock.packages['']).toMatchObject({
      name: packageJson.name,
      version: packageJson.version,
      license: packageJson.license,
      dependencies: packageJson.dependencies,
      devDependencies: packageJson.devDependencies,
    });
  });
});
