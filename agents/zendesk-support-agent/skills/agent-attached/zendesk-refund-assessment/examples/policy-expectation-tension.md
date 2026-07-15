# Example: policy and customer expectation are in tension

## Input pattern

Customer wants a full refund after using a service for 30 days because `it did not deliver the results we expected`. Public policy says refunds are available only within 14 days or where a confirmed billing error occurred. Ticket notes show onboarding guidance was provided, but no documented service failure or billing error is confirmed.

## Expected assessment pattern

- Classify as `refund` with possible `goodwill` or `policy_exception` if support wants to consider a make-good.
- Confirm the customer expectation and usage period.
- Confirm the policy constraint: outside standard refund window and no billing error shown.
- Mark product/service failure evidence as missing if not supplied.
- Recommend not deciding yet if the business may consider goodwill, or draft a cautious policy-grounded response if the policy answer is already approved.
- Recommended downstream skill: `zendesk-help-center-grounding` if policy wording must be aligned, or `zendesk-draft-response` if the decline/alternative offer is already approved.

## Safety note

Do not say `refund denied` as a final customer decision unless the user asks for a customer-facing response and the authority to decline is clear.
