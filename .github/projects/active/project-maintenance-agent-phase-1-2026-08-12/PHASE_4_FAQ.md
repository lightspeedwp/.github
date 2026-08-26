# Project Maintenance Agent — FAQ

**Quick answers to common questions**

---

## General Questions

### Q: What is the Project Maintenance Agent?

**A:** An automated tool that audits project documentation, identifies gaps, and can create missing files from templates. Runs nightly (automated) and on-demand (manual).

### Q: Who should use this?

**A:** Development team, project managers, technical leads—anyone responsible for maintaining project documentation.

### Q: Why do we need this?

**A:** To keep project documentation consistent across 50+ projects without manual work. Catches gaps early, saves time, reduces errors.

### Q: How does it work?

**A:**

1. **Nightly:** Scans all projects at 2 AM UTC, posts report to Slack
2. **On-Demand:** You trigger a workflow to audit, create, validate, or archive projects
3. **Integration:** Uses Phase 1 automation scripts with Slack notifications

---

## Getting Started

### Q: How do I get started?

**A:**

1. Read: PHASE_4_TRAINING_GUIDE.md (30 min)
2. Watch: Nightly audit result in Slack (tomorrow morning)
3. Try: Run an audit with on-demand workflow
4. Reference: Use PHASE_4_OPERATIONS_RUNBOOK.md for common tasks

### Q: Do I need to install anything?

**A:** No! It's built into GitHub Actions. Just use the workflows from the Actions tab.

### Q: What permissions do I need?

**A:**

- Read access to view projects: Everyone
- Write access to create/update/archive: Developers, maintainers
- Admin access for Slack webhook: Tech lead

### Q: Where are the workflows?

**A:** `.github/workflows/`

- `project-maintenance-nightly.yml` — Auto-runs daily
- `project-maintenance-on-demand.yml` — Manual trigger

---

## Using the Nightly Audit

### Q: When does the nightly audit run?

**A:** Every day at 2 AM UTC. You'll see the Slack notification in the morning (usually 6-8 AM for US timezones).

### Q: How long does it take?

**A:** 30-60 seconds for 50+ projects. Slack notification appears shortly after.

### Q: What does the audit check?

**A:**

- Which projects have README.md?
- Which projects have PLANNING.md?
- Which projects have OPENSPEC.md?
- Are they missing (report gaps)

### Q: Can I see the full audit results?

**A:** Yes! Check Slack notification or:

- GitHub Actions → project-maintenance-nightly.yml
- Expand job logs → Look for "Audit Results"

### Q: Do I have to do anything after the nightly audit?

**A:** No, it's optional. The audit is just visibility. Fix gaps if you want, or ignore if not urgent.

### Q: What if I want to run the audit manually?

**A:** Use the on-demand workflow:

- GitHub Actions → "Project Maintenance — On-Demand"
- operation: audit
- projects: all (or specific projects)
- dry_run: true

### Q: Can the nightly audit break anything?

**A:** No! It only reads data. No files are created or modified. It's safe to ignore.

---

## Using On-Demand Operations

### Q: How do I create missing documentation?

**A:**

```

GitHub Actions → "Project Maintenance — On-Demand"
operation: create-docs
projects: [list projects]
dry_run: true (preview first!)
Then run again with dry_run: false

```

### Q: What files can be created?

**A:**

- README.md — Project overview
- PLANNING.md — Project plan and timeline
- OPENSPEC.md — Technical specification

### Q: Why use dry_run first?

**A:** It shows you what will be created before actually creating it. Always dry-run first!

### Q: What if I only want some files created?

**A:**

```

operation: create-docs
projects: my-project
files: PLANNING.md  (or: PLANNING.md,OPENSPEC.md)
dry_run: true

```

### Q: What templates are used?

**A:** Files in `.github/projects/_templates/`

- PLANNING.md.template
- OPENSPEC.md.template
- README.md.template

### Q: Can I customize the templates?

**A:** Yes! Edit the template files:

```bash

.github/projects/_templates/PLANNING.md.template

# Add/remove content as needed

# Commit and next create-docs uses updated template


```

### Q: What if the created file content is wrong?

**A:**

1. Check template file content (above)
2. Edit template if needed
3. Delete created file and re-run create-docs
4. Or manually edit created file and commit

### Q: Does create-docs overwrite existing files?

**A:** No, it skips files that already exist. If you want to regenerate a file:

1. Delete it manually
2. Run create-docs again

---

## Validation

### Q: What does the validate operation check?

**A:**

- Does project folder exist?
- Does README.md exist and have frontmatter?
- Does PLANNING.md have valid YAML?
- Are all required metadata fields present?
- Are links valid (not broken)?

### Q: Why should I validate?

**A:** To catch metadata issues before they cause problems. Helps maintain consistent project structure.

### Q: How often should I validate?

**A:** Optional, but good practice:

- After creating new projects
- After editing metadata manually
- When troubleshooting issues

### Q: What if validation fails?

**A:** Follow the recommendations:

- Add missing field to frontmatter
- Fix YAML syntax error
- Create missing file
- See PHASE_4_TROUBLESHOOTING.md for detailed solutions

---

## Archival

### Q: What does archive do?

**A:** Moves a completed project from `active/` folder to `archive/` folder. Creates `.archive-status.md` with metadata.

### Q: When should I archive a project?

**A:** When project work is complete and no longer active.

### Q: How do I archive a project?

**A:**

```

GitHub Actions → "Project Maintenance — On-Demand"
operation: archive
projects: completed-project
dry_run: true (ALWAYS preview first!)
Then run with dry_run: false

```

### Q: Can I unarchive a project?

**A:** Yes, move the folder back manually:

```bash

git mv .github/projects/archive/my-project \
       .github/projects/active/
git commit -m "Restore my-project from archive"

```

### Q: Are archived projects deleted?

**A:** No, they're just moved to the `archive/` folder. They still exist and can be restored.

### Q: Should I delete archived projects eventually?

**A:** Optional. You can keep them for history or delete after a certain time. Organization preference.

---

## Slack Integration

### Q: Will I get Slack notifications?

**A:** Yes, if Slack webhook is configured. Follow: SLACK_WEBHOOK_SETUP.md

### Q: What notifications will I get?

**A:**

- **Nightly:** Audit results at 2 AM UTC
- **Manual:** Results of on-demand operations
- **Alerts:** If audit finds critical gaps (>5 projects with issues)

### Q: Can I customize the Slack channel?

**A:** Yes! The webhook is created for a specific channel. You can create multiple webhooks for different channels.

### Q: What if I don't want Slack notifications?

**A:** That's OK! The workflows will still run. You just won't get notified. You can check results in GitHub Actions.

### Q: How do I configure Slack?

**A:** Follow: SLACK_WEBHOOK_SETUP.md in the project folder.

---

## Troubleshooting

### Q: The workflow failed. What do I do?

**A:**

1. Go to: GitHub Actions → Select failed workflow
2. Click: See all jobs
3. Look for: Red X (failed step)
4. Click: Expand logs and read error message
5. Check: PHASE_4_TROUBLESHOOTING.md for your error

### Q: The script says "permission denied". How do I fix it?

**A:** Likely a folder permission issue:

```bash

chmod 755 .github/projects/active/
chmod 644 .github/projects/active/*/*.md
git add -A && git commit -m "fix: Correct permissions"

```

See: PHASE_4_TROUBLESHOOTING.md for more details

### Q: The Slack message didn't send. Why?

**A:** Usually webhook issue. Check:

1. Webhook exists in Slack workspace
2. Webhook hasn't expired (regenerate if needed)
3. URL in GitHub secret is correct
4. Workflow is configured to send to Slack

See: PHASE_4_TROUBLESHOOTING.md for detailed steps

### Q: The workflow timed out. Why?

**A:** Too many projects in one run (>50). Solution:

```

Split into batches:
Batch 1: projects: [first 25]
Batch 2: projects: [next 25]

```

See: PHASE_4_OPERATIONS_RUNBOOK.md → Workflow Timeout

### Q: I made a mistake and archived the wrong project. Can I fix it?

**A:** Yes! Move it back:

```bash

git mv .github/projects/archive/wrong-project \
       .github/projects/active/
git commit -m "Restore wrong-project from archive"

```

### Q: Still stuck? What do I do?

**A:**

1. Check PHASE_4_TROUBLESHOOTING.md
2. Check PHASE_4_OPERATIONS_RUNBOOK.md
3. Create GitHub issue: type: support, label: project-maintenance
4. Include error message, what you tried, next steps

---

## Advanced Questions

### Q: Can I use this for non-GitHub projects?

**A:** The workflows are GitHub-specific (use GitHub Actions). But the Phase 1 scripts could be adapted for other platforms.

### Q: Can I customize which files get created?

**A:** Yes! Edit the templates in `.github/projects/_templates/` or modify the create-docs operation.

### Q: How does this integrate with other tools?

**A:**

- **Phase 2 Agent:** Will use skills from this project
- **Task Planning Agent:** Can call maintenance operations
- **CI/CD:** Runs within GitHub Actions
- **Slack:** Posts notifications

### Q: Can multiple people run operations at the same time?

**A:** Yes, workflows are independent and won't conflict.

### Q: How do I monitor this over time?

**A:**

- Check Slack notifications daily
- Periodically run validate operation
- Monitor GitHub Actions execution times
- Archive old projects to keep active folder lean

### Q: What if I want to run this outside GitHub?

**A:** You could extract Phase 1 scripts and run them locally or in other CI systems. But currently designed for GitHub Actions.

### Q: Can I disable the nightly audit?

**A:** Yes, comment out or delete the nightly workflow file. But visibility goes away.

---

## Performance & Scaling

### Q: How fast is the audit?

**A:** ~1 second per 5-10 projects. 50 projects ≈ 30-60 seconds.

### Q: How much does it cost?

**A:** GitHub Actions free tier: 2,000 minutes/month. Nightly audit uses ~1 minute/day = 30 min/month. Plenty of headroom.

### Q: What if I have 100+ projects?

**A:**

- Audit still fast (~2 min)
- Strongly recommend archiving old projects
- Split create-docs into batches (25 at a time)

### Q: Can I run hourly audits instead of daily?

**A:** Yes! Edit the cron schedule:

```yaml

schedule:

  - cron: '0 * * * *'  # Every hour

```

But 2 AM daily is usually sufficient.

---

## Security & Safety

### Q: Is dry_run mode truly safe?

**A:** Yes, it only reads data. No files are created or modified.

### Q: What permissions does the agent have?

**A:** Same as GitHub Actions: read `.github/projects/`, write access for creating/updating files.

### Q: Can the agent break anything?

**A:** Only if you run live operations (non-dry-run) without reviewing preview first. Always dry-run first!

### Q: Are files backed up?

**A:** Yes, Git history. If you accidentally overwrite a file, you can recover from git history.

### Q: Who should have access to create/archive projects?

**A:** Developers and maintainers. Consider requiring review for archive operations.

---

## Getting Help

### Q: Where do I find documentation?

**A:**

- **Overview:** README.md
- **Full spec:** PLANNING.md
- **Training:** PHASE_4_TRAINING_GUIDE.md
- **How-to:** PHASE_4_OPERATIONS_RUNBOOK.md
- **Errors:** PHASE_4_TROUBLESHOOTING.md
- **Setup:** SLACK_WEBHOOK_SETUP.md
- **Implementation:** PHASE_3_IMPLEMENTATION.md (workflows)

### Q: How do I report a bug?

**A:** Create GitHub issue with:

- What you tried
- What went wrong
- Error message
- Link to workflow run
- Label: project-maintenance

### Q: How do I suggest a feature?

**A:** Create GitHub issue:

- What feature would help?
- Why do you need it?
- How would it work?
- Label: enhancement

### Q: Who maintains this?

**A:** See project README.md for owners and maintainers.

---

## Next Steps

### Q: I read the FAQ, what's next?

**A:**

1. ✅ Read PHASE_4_TRAINING_GUIDE.md (30 min)
2. ✅ Wait for nightly audit notification (tomorrow)
3. ✅ Try an on-demand audit (15 min)
4. ✅ Try creating docs for a project (30 min)
5. ✅ Bookmark PHASE_4_OPERATIONS_RUNBOOK.md for reference
6. ✅ You're ready!

### Q: What if I'm a developer?

**A:** Check PHASE_2_KICKOFF.md if you want to understand how the agent works.

### Q: What if I'm an operator?

**A:** Bookmark PHASE_4_OPERATIONS_RUNBOOK.md and PHASE_4_TROUBLESHOOTING.md.

---

## Still Have Questions?

**Questions not in this FAQ?**

1. Check PHASE_4_TRAINING_GUIDE.md (more detailed explanations)
2. Check PHASE_4_TROUBLESHOOTING.md (error-specific help)
3. Check PHASE_4_OPERATIONS_RUNBOOK.md (procedures)
4. Create GitHub issue with your question (label: question)

---

*FAQ v1.0 — 2026-08-18*
*50+ common questions answered*
