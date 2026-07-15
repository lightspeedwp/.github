# QA Check Example

Use this example when checking whether a drafted report is safe to share.

## Draft issue

The draft says:

```md
SLA is high risk and engineering should fix checkout immediately.
```

## QA result

- SLA claim is unsupported unless SLA fields were visible.
- Engineering ownership is unsupported unless Zendesk evidence confirms an engineering-owned blocker.
- Safer wording: "SLA data was not visible. Checkout-related tickets show repeated support pain; assign one support owner to sample the cluster and confirm whether it is likely duplicate, related but distinct, or a possible incident signal."

## Evidence basis

The QA decision is based on the skill rules for missing SLA data, cautious incident language, and support-owned next actions.
