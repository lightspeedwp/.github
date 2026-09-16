# Catalog Entry Validation Checklist

**Purpose**: Validation checklist for verifying CATALOG.md completeness and correctness  
**Created**: 2026-09-16  
**Feature**: [Specification Catalog](../spec.md)

**Note**: This checklist validates that catalog entries are complete, accurate, and linked properly. Each item must be satisfied for the catalog to pass acceptance criteria (SC-003, SC-008).

---

## Catalog Entry Completeness

- [ ] All 12 existing specifications (001-012) have entries in CATALOG.md
- [ ] Specification 013 has a catalog entry
- [ ] Entry count in CATALOG.md matches file count in `.github/specs/`
- [ ] Each entry includes required fields: number, slug, title, purpose, status, created date
- [ ] Each entry includes link to spec directory (format: `specs/{NNN}-{slug}/`)

---

## Link Validity

- [ ] All directory links in catalog point to existing spec directories
- [ ] Links follow format: `specs/{NNN}-{slug}/` (relative path)
- [ ] No broken or malformed links
- [ ] Can navigate from catalog entry to actual spec.md file (via link)

---

## Data Accuracy

- [ ] Spec number in catalog matches directory name (e.g., catalog says 001 for `specs/001-*`)
- [ ] Spec slug in catalog matches directory slug (e.g., catalog says `prd-agent-consolidation` for `specs/001-prd-agent-consolidation/`)
- [ ] Spec title in catalog matches spec.md title
- [ ] Status field is current (Active, Draft, Archived, Deprecated)
- [ ] Created date is accurate (matches spec creation date if documented)

---

## Catalog Currency

- [ ] Catalog last updated date is within 7 days of most recent spec creation
- [ ] Any new specifications added within last 7 days are in catalog
- [ ] Any archived/deprecated specs are marked with status change (not deleted)

---

## Sequential Numbering in Catalog

- [ ] Specifications listed in sequential order (001, 002, 003, ..., 013)
- [ ] No duplicate numbers in catalog
- [ ] No gaps in sequential numbering (e.g., 001, 002, skip 003, 004... is invalid)

---

## Format Compliance

- [ ] Catalog uses consistent table format (markdown table)
- [ ] Table has headers: Number, Slug, Title, Purpose, Status, Created
- [ ] All rows aligned and properly formatted
- [ ] No manually entered inconsistencies (spelling, capitalization, formatting)

---

## Governance Compliance

- [ ] Catalog entries marked Draft are not yet approved by governance authority
- [ ] Catalog entries marked Active have governance approval documented
- [ ] Catalog entries marked Archived include date and reason (if documented)
- [ ] Catalog location is `.github/specs/CATALOG.md` (per spec requirement FR-004)

---

## Notes

- Mark items `[x]` only when validator confirms the requirement is satisfied
- Use this checklist before finalizing CATALOG.md for each release
- Catalog currency check (items in "Catalog Currency" section) should be performed on 7-day intervals
- If any item fails, document the specific issue and remediation needed before marking complete

---

**Checklist Version**: 1.0 | **Last Updated**: 2026-09-16 | **Type**: Catalog Validation
