# Validation Reference Alignment Prompt

## Purpose
Use this recurring prompt to align README and reference-layer wording that materially affects validation accuracy, without turning the pass into a general documentation rewrite.

## Prompt
Audit and align the validation reference layer so README and reference wording that affects validation accuracy matches the real file tree and current validator expectations.

Primary goal:
- make validation-relevant README and reference wording accurate and mutually consistent
- remove stale file inventories, stale folder expectations, and outdated validation references
- leave the validation reference layer clear enough that it does not mislead later validation work

Scope priorities:
1. root `README.md`
2. folder `README.md` files whose wording affects validation accuracy
3. validation-relevant reference docs
4. only then nearby linked notes when they materially affect validation truthfulness

Required working rules:
- Treat the actual file tree and current validator entry points as source of truth.
- Prefer structural accuracy over stylistic rewriting.
- Keep folder names, file paths, and validation references exact.
- Do not invent files, folders, references, or validation layers that are not grounded.
- Keep the pass focused on validation-relevant documentation only.

During the pass:
- compare README and reference wording against the current structure and documented validation entry points
- tighten stale file inventories, stale folder maps, and outdated validation references
- align optional-versus-required wording where it materially affects validation interpretation
- avoid broad non-validation documentation cleanup unless a nearby inconsistency would keep the validation layer misleading

Output requirements:
1. short validation reference alignment summary
2. exact files updated
3. any remaining non-blocking reference-layer follow-up opportunities
4. explicit confirmation of whether the validation reference layer still has blockers

Validation expectation:
- Run the documented validation entry point when validation-sensitive README or reference guidance changes and the validator files are available.
- Keep the pass narrowly focused on validation accuracy in the reference layer.
