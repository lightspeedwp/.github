import { categorizeBranches, validateBranchName } from './scripts/lib/branch-categorization.js';
import { getAgeInDays } from './scripts/lib/age-calculator.js';

console.log(getAgeInDays('2026-08-15T10:00:00Z'));
console.log(validateBranchName('feat/login-screen'));
console.log(validateBranchName('claude/bad'));

const result = categorizeBranches(
  ['feat/old-feature', 'main', 'release/v1.0'],
  {
    'feat/old-feature': {
      author: 'alice',
      lastCommitDate: '2026-07-15T10:00:00Z',
      mergeStatus: { merged: true, state: 'merged' },
    },
  },
  new Set(),
  /release\/.*|hotfix\/.*/,
  30
);

console.log('KEEP:', result.KEEP.length);
console.log('DELETE:', result.DELETE.length);
console.log('DISCUSS:', result.DISCUSS.length);
