# PRD To Test Cases Example

## Scenario

A LightSpeed team is preparing Playwright coverage for a WooCommerce site launch. The PRD defines guest checkout, coupon handling, and inline validation expectations for the cart and checkout flow.

## Inputs

- PRD excerpt covering guest checkout and coupon acceptance rules
- Approved checkout acceptance criteria
- Staging environment at `https://example.test`
- Supporting Figma checkout frame references

## Output

The agent extracts requirement IDs such as `REQ-CHK-001` and `REQ-CHK-002`, classifies them as functional and validation rules, and produces human-readable test cases before any Playwright code is generated. Each test case includes actor, preconditions, steps, expected result, assertions, accessibility checks, visual checks, and evidence references.

## Why This Works

This example follows the default workflow by turning approved requirements into reviewable test cases first. It preserves traceability, avoids invented coverage, and keeps checkout state changes clearly flagged.

## Related Schema

`schemas/test-case.schema.json`
