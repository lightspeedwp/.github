# Section Structure & Outline Analysis

**Tasks**: T032–T037 Section mapping and cross-references

## CLAUDE.md Section Outline (T032)

```
1. Header & Repository Purpose (lines 1-20)
2. ⚠️ Branch Naming — CRITICAL (lines 22-111)
   - Branch pattern and examples
   - Allowed types (34 total)
   - Forbidden prefixes
   - Why this matters
   - Validation script
3. Git Workflow (lines 113-130)
4. Development Commands (lines 132-142)
5. Key Conventions (lines 144-160)
6. 🔒 Configuration Files — LOCKED (lines 162-180)
   - Labels, issue types, templates
   - Change request mechanism
7. Label Creation Rules (lines 182-215)
8. Repository Boundaries (lines 217-234)
9. What Not to Do (lines 236-250)
10. Related Files (lines 252-262)
```

**Total Sections**: 10 major sections  
**Focus**: Git workflow, branch naming, configuration management, file organization

---

## AGENTS.md Section Outline (T033)

```
1. Header and Global AI Rules (lines 1-34)
2. Agent Directory (lines 36-40)
3. Agent Test Status (lines 42-50)
4. Repository Scripts Organisation (lines 52-102)
   - Script categorization
   - File placement rules
5. Branch Naming Governance (lines 104-146)
6. Contribution Guidelines & Indexes (lines 148-168)
7. Locked Configuration Files (lines 170-207)
8. Label Creation Governance v1 (lines 209-253)
   - CRITICAL section (DUPLICATE)
9. PR Templates (lines 255-261)
10. Core Index Instructions (lines 263-270)
11. Cross-References & Discoverability (lines 272-283)
12. Label Creation Governance v2 (lines 285-338)
   - CRITICAL section (DUPLICATE)
13. References (lines 340-352)
```

**Total Sections**: 12 level-two sections, including 1 duplicated topic, plus the document heading
**Focus**: Agent governance, script and branch rules, contribution guidance, locked configuration, indexes, and label management

---

## Overlap & Relationship Analysis (T034)

### Direct Overlap

| Topic | CLAUDE.md | AGENTS.md | Status |
|-------|-----------|-----------|--------|
| Branch Naming | Lines 22-111 | Implicit in Rules | OVERLAPPING |
| Git Workflow | Lines 113-130 | Not covered | UNIQUE to CLAUDE.md |
| Label Governance | Lines 182-215 | Lines 209-252, 285-338 | **DUPLICATE** |
| Configuration Files | Lines 162-180 | References only | Primary in CLAUDE.md |
| Script Organization | Not in CLAUDE.md | Lines 52-102 | Unique to AGENTS.md |

### Suggested Reorganization

1. **Keep in CLAUDE.md**: Branch naming (primary authority), Git workflow, Configuration files, Repository boundaries
2. **Keep in AGENTS.md**: AI development, Script organization, Prompt organization, Agent configuration
3. **Consolidate**: Label Creation Governance (currently duplicated in AGENTS.md)

---

## Cross-Reference Summary (T035-T037)

### References FROM CLAUDE.md TO AGENTS.md
1. Line 3: "Full organisation-wide AI rules... live in [AGENTS.md](./AGENTS.md)"
2. Line 252: "[AGENTS.md](./AGENTS.md) — full global AI rules"

### References FROM AGENTS.md TO CLAUDE.md
1. Line 5: "See [CLAUDE.md](CLAUDE.md) for branch naming and Git workflow"
2. Line 60: References CLAUDE.md for branch naming validation
3. Line 145: Cross-reference for full branch type list

### Internal Links Found

**CLAUDE.md Internal Links**:
- 5 Markdown links to sections within repo (.github/*, docs/*)
- All point to real or documented locations

**AGENTS.md Internal Links**:
- 3 Markdown links to .github sections
- 2 references to scripts (one missing: validate-labels-before-creation.cjs)

### Broken Link Count: 5
- `.github/instructions/branch-naming.instructions.md` (referenced by both governance files)
- `.github/instructions/coding-standards.instructions.md` (referenced by CLAUDE.md)
- `.github/instructions/file-organisation.instructions.md` (referenced by CLAUDE.md)
- `.github/instructions/plugin-structure.instructions.md` (referenced by CLAUDE.md)
- `.github/scripts/validation/validate-labels-before-creation.cjs` (referenced by AGENTS.md)

---

## Conclusion

- **Section Clarity**: Good separation of concerns between files
- **Cross-Reference Quality**: Appropriate and minimal (2 files should reference each other lightly)
- **Duplicate Impact**: One section duplicated, causing maintenance debt
- **Missing References**: Five references point to paths missing from the audited snapshot
- **Reorganization Benefit**: Moving script organization rules to CLAUDE.md or instructions/ would clarify ownership
