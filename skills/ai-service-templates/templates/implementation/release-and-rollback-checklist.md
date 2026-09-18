# Release and Rollback Checklist

## Client

- Client: {{client.name}}
- Package: {{package.name}}
- Release owner: {{release.owner}}
- Target release date: {{release.target_date}}

## Pre-Release

- [ ] Scope signed off
- [ ] QA complete
- [ ] Client UAT complete
- [ ] Critical issues resolved
- [ ] Handover notes ready
- [ ] Monitoring owner confirmed
- [ ] Rollback/disable process confirmed

## Release Steps

| Step | Owner | Status | Notes |
|---|---|---|---|
| {{release_step.name}} | {{release_step.owner}} | {{release_step.status}} | {{release_step.notes}} |

## Rollback Plan

| Trigger | Action | Owner | Notes |
|---|---|---|---|
| {{rollback.trigger}} | {{rollback.action}} | {{rollback.owner}} | {{rollback.notes}} |

## Post-Release

- [ ] Smoke test completed
- [ ] Logs or transcripts reviewed, if applicable
- [ ] Client notified
- [ ] Open issues logged
- [ ] Follow-up review scheduled

## Release Decision

- Status: {{release.status}}
- Approved by: {{release.approved_by}}
- Notes: {{release.notes}}
