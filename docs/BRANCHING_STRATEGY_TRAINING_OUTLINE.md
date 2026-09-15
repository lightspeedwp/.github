# Branch Naming Strategy — Training Outline for Team Leads

**Duration:** 15-20 minutes  
**Audience:** Developers and team members  
**Materials:** This outline + live demo

---

## Slide 1: Why Branch Naming Matters (2 minutes)

**Key Points:**

- Branch names drive automation (PR templates, labels, workflows)
- Consistent naming = predictable automation
- Wrong names break PR assignment and labeling
- Example: `claude/my-feature` → PR template fails → manual fix needed

**Visual:** Show before/after of PR with correct vs. incorrect template

---

## Slide 2: The Pattern (2 minutes)

**Key Points:**

- Pattern: `{type}/{scope}-{title}`
- Example: `feat/user-authentication-system`
- Components breakdown:
  - Type: kind of work (feat, fix, docs, etc.)
  - Scope: what's affected (user, auth, api, etc.)
  - Title: details (authentication-system)

**Demo:** Show 3-4 good examples, explain each component

---

## Slide 3: Quick Type Reference (3 minutes)

**Simplest Approach:**

- Is it a **new feature**? → `feat/`
- Is it a **bug fix**? → `fix/`
- Is it **documentation**? → `docs/`
- Is it **testing**? → `test/`
- Is it **code cleanup**? → `chore/` or `refactor/`
- Is it **something else**? → See full guide

**Visual:** Simple decision flowchart or table

---

## Slide 4: Naming Rules (2 minutes)

**DO:**

- ✅ Use lowercase: `user-auth`
- ✅ Use hyphens: `add-feature` (not `add_feature`)
- ✅ Be specific: `fix-null-pointer-in-payment`

**DON'T:**

- ❌ Use forbidden prefixes: `claude/`, `copilot/`, `openai/`
- ❌ Use underscores: `user_auth`
- ❌ Use uppercase: `User-Auth`
- ❌ Be too vague: `fix/bug` or `feat/stuff`

**Demo:** Show examples of good vs. poor names

---

## Slide 5: Forbidden Prefixes (1 minute)

**Never use:**

- ❌ `claude/` — breaks PR automation
- ❌ `copilot/` — breaks workflows
- ❌ `openai/` — breaks validation

**Why?** These are reserved for internal systems. Using them breaks PR template routing and GitHub Actions.

---

## Slide 6: How It Works (2 minutes)

**Branch Type → PR Template:**

- `feat/` → `pr_feature.md` template
- `fix/` → `pr_bug.md` template
- `security/` → `pr_security.md` template
- etc.

**Branch Type → Labels:**

- `feat/` → `type:feature` label
- `security/` → `type:security`, `priority:critical` labels
- Scope keywords → area labels (e.g., `api` → `area:api`)

**Visual:** Show PR with correct template + labels applied

---

## Slide 7: Live Demo (3-5 minutes)

**Demo Steps:**

1. **Show validation with good branch:**

   ```bash
   npm run validate:branch-name -- --branch feat/dark-mode
   # Output: "Branch matches branching strategy"
   ```

2. **Show validation failure:**

   ```bash
   npm run validate:branch-name -- --branch claude/my-feature
   # Output: "ERROR: forbidden prefix"
   ```

3. **Show how to fix it:**

   ```bash
   git branch -m claude/my-feature feat/my-feature
   npm run validate:branch-name -- --branch feat/my-feature
   # Output: "Branch matches branching strategy"
   ```

4. **Show PR template routing** (if possible):
   - Create test PR with `feat/` branch
   - Show correct template auto-applied
   - Show labels auto-applied

---

## Slide 8: Getting Help (1 minute)

**Resources:**

- **Quick reference:** [One-Pager](./BRANCHING_STRATEGY_ONE_PAGER.md) (save locally)
- **Common questions:** [FAQ](./BRANCHING_STRATEGY_FAQ.md)
- **Full guide:** [Full Branching Strategy](./BRANCHING_STRATEGY.md)
- **Team support:** Ask your team lead or check Slack

**Key point:** It's easy! Validation tells you immediately if you got it wrong.

---

## Slide 9: Q&A (2-3 minutes)

**Common questions to anticipate:**

1. "What's the difference between `task` and `feat`?"  
   → `feat` for user features, `task` for large project work

2. "What if I make a mistake?"  
   → Run validation command, rename branch if wrong, push again

3. "Can I use different naming?"  
   → No, it's enforced by automation

4. "Which type should I use?"  
   → See decision tree on the one-pager

---

## Training Tips

**Before Training:**

- Share the one-pager with developers
- Prepare a live demo environment
- Have the FAQ open for reference

**During Training:**

- Emphasize the validation command — it's your safety net
- Show the decision tree — helps developers pick the right type
- Do the live demo — makes it concrete
- Take questions — common questions → FAQ improvements

**After Training:**

- Provide one-pager print-outs
- Post FAQ in team Slack channel
- Point new team members to the recording

---

## Troubleshooting

**If developers keep making mistakes:**

- Add type to checklist: "Is my branch name `{type}/{scope}-{title}`?"
- Remind about validation: "Run `npm run validate:branch-name` before pushing"
- Share specific examples from your team's work

**If you get lots of similar questions:**

- Add new entry to FAQ
- Create team-specific guide extending the standard one
- Share in next team meeting

---

## Optional Extensions

**If you have more time:**

1. **Show PR template examples** — Explain what template fields mean and why they matter
2. **Show labeling impact** — Explain how labels power project tracking and automation
3. **Discuss area keywords** — Show how scope keywords auto-detect area labels
4. **Walk through type reference** — Deep dive on specific types if your team needs it
5. **Discuss release flow** — Explain `release/` and `hotfix/` types specifically

---

## Recording Notes

If recording this for later use:

- Keep it under 20 minutes
- Focus on the pattern + validation + quick types
- Do a live demo (developers need to see it working)
- End with "See FAQ for common questions"
- Provide one-pager link in video description

---

## Checklist

Before training:

- [ ] One-pager printed or screen-shared
- [ ] Demo environment ready
- [ ] FAQ open for reference questions
- [ ] Examples from recent PRs
- [ ] Live validation command tested
- [ ] Understand 24 types well enough to explain

After training:

- [ ] Collect questions that aren't in FAQ
- [ ] Update FAQ based on new questions
- [ ] Follow up with developers who seemed confused
- [ ] Schedule refresher training if many questions

---

*Last Updated: September 2026*  
*For questions, see the [FAQ](./BRANCHING_STRATEGY_FAQ.md) or contact your team lead.*
