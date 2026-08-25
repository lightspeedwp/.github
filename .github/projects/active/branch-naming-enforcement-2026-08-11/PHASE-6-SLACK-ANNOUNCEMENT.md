# Phase 6 Slack Announcements

Copy-paste ready Slack messages for Phase 6 branch naming enforcement rollout.

---

## Message 1: Initial Announcement (Aug 12)

**Destination:** #engineering (or project channel)  
**When:** August 12, 2026 (morning, before standup)

```
🚀 *Branch Naming Enforcement — Phase 6 Rollout Starts Today*

Team, we're rolling out branch naming enforcement starting *today, August 12*.

*What's changing:*
All branches must now follow: `{type}/{scope}-{short-title}`

✅ Valid examples:
• feat/user-authentication
• fix/login-timeout
• chore/update-deps

❌ Invalid examples:
• my-feature (missing type)
• Feature/MyBranch (uppercase)
• feat_my_feature (underscore)

*Timeline:*
📅 Aug 12-18: Grace period (warnings only)
🔒 Aug 19 (00:00 UTC): Enforcement active (PR merges blocked)

*Setup (optional but recommended):*
```bash
npm run setup:hooks
```

More details: Read the full announcement thread 👇
```

---

## Message 2: Setup Instructions (Aug 12, in thread)

**Destination:** Reply in thread to Message 1  
**When:** August 12, 2026 (10-15 min after initial message)

```
*Setup Instructions for Your Local Environment*

1️⃣ *Install the hook* (recommended):
```bash
npm run setup:hooks
```

2️⃣ *Test with a temporary branch:*
```bash
git checkout -b invalid-branch-name
git commit --allow-empty -m "test"
# Hook will warn (not block) during grace period
git checkout - && git branch -D invalid-branch-name
```

3️⃣ *Verify valid branches work:*
```bash
git checkout -b feat/your-feature
# Should work fine
git checkout -
git branch -D feat/your-feature
```

4️⃣ *Rename any old branches:*
If you have branches that don't follow the format, rename them before Aug 19.

*Complete the setup checklist:* See pinned message (PHASE-6-SETUP-VERIFICATION-CHECKLIST.md)

*Questions?* Reply here or DM @governance-team
```

---

## Message 3: Adoption Check-In (Aug 15)

**Destination:** #engineering (or project channel)  
**When:** August 15, 2026 (end of day)

```
📊 *Phase 6 Adoption Check-In — Aug 15*

We're 3 days into the grace period. Here's where we stand:

*Current Adoption:* XX% (target: 80%+)
*Hook Installations:* XX (target: 80%+)
*Branches Renamed:* XX (target: 100%)
*Support Issues:* XX (target: <5)

*Still need to set up?* No worries! You have until Aug 18 (23:59 UTC).

Here's what you need to do:
1. Install the pre-commit hook: `npm run setup:hooks`
2. Test with a temporary branch
3. Rename any invalid branches
4. Complete the setup checklist

*Blockers or questions?* Reply in this thread 👇
```

---

## Message 4: Final Reminder (Aug 18)

**Destination:** #engineering (or project channel)  
**When:** August 18, 2026 (morning)

```
⏰ *Final Reminder: Phase 6 Enforcement Goes Live Tomorrow (Aug 19)*

The branch naming enforcement grace period **ends today at 23:59 UTC**.

*What you need to do by EOD today:*
1. ✅ Install the hook: `npm run setup:hooks`
2. ✅ Rename any invalid branches
3. ✅ Complete the setup checklist
4. ✅ Reply with confirmation

Starting *tomorrow, Aug 19 at 00:00 UTC*, PR merges will be **blocked** for branches that don't follow `{type}/{scope}-{short-title}`.

*Last-minute questions?* Reply here or DM @governance-team ASAP!
```

---

## Message 5: Enforcement Go-Live (Aug 19, 00:00 UTC)

**Destination:** #engineering (or project channel)  
**When:** August 19, 2026 (00:00 UTC) — or immediately after

```
🔒 *Phase 6 Enforcement is Now LIVE*

Branch naming enforcement is now active on GitHub Actions. All PRs will be checked for valid branch names.

*What happens now:*
✅ Valid branches: PRs merge normally
🚫 Invalid branches: PR merges are blocked

*Need to rename your branch?*
```bash
git branch -m old-name feat/new-name
git push origin feat/new-name
git push origin :old-name
```

*Got blocked on your PR?*
Rename your branch and push the update. GitHub will re-run validation automatically.

*Have issues?* DM @governance-team or reply here 👇
```

---

## Message 6: Metrics & Success (Aug 26)

**Destination:** #engineering (or project channel)  
**When:** August 26, 2026

```
✅ *Phase 6 Rollout Complete — Success Metrics*

We've successfully rolled out branch naming enforcement. Here's how we did:

*Results:*
📈 Adoption: XX%
🎯 Target: 80%+ ✅ ACHIEVED
📊 Hook installations: XX
🛡️ PR blocks avoided: XX (all team members ready)
💬 Support requests: XX (<5 target) ✅ ACHIEVED

*What's next:*
• Enforcement remains active indefinitely
• Pre-commit hook is optional but recommended
• Questions? Reference docs/BRANCHING_STRATEGY.md

Thanks for making the transition smooth! 🙏
```

---

## Copy-Paste Script (All Messages)

For easy reference, here's all messages in order:

**Message 1 (Aug 12):** Initial announcement  
**Message 2 (Aug 12):** Setup instructions (in thread)  
**Message 3 (Aug 15):** Adoption check-in  
**Message 4 (Aug 18):** Final reminder  
**Message 5 (Aug 19, 00:00 UTC):** Enforcement go-live  
**Message 6 (Aug 26):** Metrics & success  

---

## Slack Thread Strategy

Keep all related messages in a **single thread** for easy reference:

1. Post Message 1 as top-level message
2. Reply with Message 2 in the thread
3. For check-ins (Messages 3-6), post new top-level messages but link back to the original thread:
   > Full details: See Phase 6 announcement thread above 👆

This keeps the channel clean while maintaining full context.

---

## Customization Notes

Replace `XX` with actual metrics on the dates specified:
- Adoption % (from PHASE-6-EXECUTION-LOG.md)
- Hook installation count (from log tracking)
- Branch rename count (from git logs)
- Support request count (from support tickets)
- Enforcement blocking count (from GitHub Actions logs)

Update the `governance-team` mention with your actual team handle or distribution list.
