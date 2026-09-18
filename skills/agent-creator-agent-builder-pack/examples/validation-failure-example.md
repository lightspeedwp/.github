# Example — Validation Failure

## Input

A pack where `OUTPUT_TEMPLATES.md` mentions a digest but no template or schema exists.

## Expected behaviour

`validate-template-schema-alignment.py` fails and points to the missing template/schema alignment.

## Expected output

Validation report with failure, affected files, and recommended fix.
