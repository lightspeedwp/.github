# Example Investigations

These examples are intentionally short. They are meant to show the reasoning shape, not prescribe exact tool calls.

## Example 1: Proof request for intermittent API failure

### Scenario

A customer says their API requests returned `502` errors for about 15 minutes today and wants to know whether the failure actually happened on the platform side or inside their integration.

### Goal

`Proof`

### Good investigation shape

- Normalize the issue:
  - confirm the customer, request IDs if available, and the affected time window
- Build the branch ledger:
  - runtime failure actually occurred
  - request reached the platform
  - issue is already a known incident or repeated pattern
- Check `[[logs]]`:
  - look for matching request IDs, status codes, or error signatures in the bounded time window
- Check {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} and {{label:Slack,id:asdk_app_69a1d78e929881919bba0dbda1f6436d,type:app}} / {{label:Asana,id:asdk_app_69616780bd208191b4fb44ba44f72b61,type:app}}:
  - see whether the failure matches a known issue or broader incident
- Form the disposition:
  - `Proven` if the failure is visible in platform-side evidence
  - `Disproven` if the requests never reached the platform or succeeded there
  - `Inconclusive` if evidence is partial or the identifier set is too weak

### Example conclusion

`Proven`: platform-side request evidence shows repeated `502` failures between
10:04 and 10:17 PT for the reported request class. I did not find evidence that
this was isolated to the customer integration, and the same signature appears in a known incident thread from today. The best next step is `customer-escalation`, plus `draft-response` for a customer-facing update.

## Example 2: RCA request for access failure after admin change

### Scenario

A customer reports that a user lost access to a workspace immediately after an admin changed team permissions. Support wants to know whether the issue was caused by a permission change, a product bug, or stale identity state.

### Goal

`RCA`

### Good investigation shape

- Normalize the issue:
  - capture the affected user, workspace, approximate timestamp, and what changed
- Build the branch ledger:
  - current permission state matches the expected role
  - access loss began right after the change
  - known issue or product limitation explains the behavior
  - implementation or configuration rules make the observed behavior plausible
- Check {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}} and `[[crm]]`:
  - confirm what support or the admin actually changed
- Check {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} / {{label:Google Drive,id:connector_5f3c8c41a1e54ad7a76272c89e2554fa,type:app}} and {{label:GitHub,id:connector_76869538009648d5b282a4bb21c3d157,type:app}}:
  - verify whether the permission model or identity behavior explains the outcome
- Check `[[logs]]` if event-time proof is required:
  - confirm the access-denied behavior occurred at the claimed time
- Form the disposition:
  - name a root cause only if both behavior evidence and implementation or policy evidence align

### Example conclusion

`Likely cause`: the access loss is consistent with the updated role scope that was applied during the admin change, and I did not find evidence of a broader product bug or known incident. The runtime evidence confirms the user began receiving access-denied responses immediately after the change window. The best next step is `draft-response` with an explanation of the permission outcome, or `customer-escalation` only if the permission result contradicts the intended policy.
