
## 11:31 | fix/meta-workflow-missing-npm-ci

Added npm ci step to meta.yml before apply-meta job to fix js-yaml errors; identified GH006: apply-meta and metrics-update jobs' push to protected develop blocked by validate-pr-template check (PR-only); awaits decision on PR+auto-merge vs bypass approach.
