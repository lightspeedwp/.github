# Survey, Poll, Quiz, and Assessment Workflows

Use this reference when the user asks for Gravity Forms surveys, polls, quizzes, assessments, knowledge checks, scoring, public results, internal reporting, feedback forms, NPS-style forms, or research-style forms.

## Scope

Gravity Forms can support feedback and assessment workflows through core fields and official add-ons. Treat Survey, Polls, and Quiz features as add-on-dependent. Never assume they are installed, licensed, active, or appropriate for the current form.

## Required preflight

Before recommending or changing these workflows, confirm:

1. Gravity Forms version and licence visibility.
2. Installed/active Survey, Polls, or Quiz add-ons.
3. Whether the form already contains Survey, Poll, Quiz, consent, hidden, or analytics fields.
4. Whether results are intended for internal review, public display, confirmation display, email notifications, or export.
5. Whether submissions should be anonymous, pseudonymous, or tied to a contact record.
6. Whether results affect user access, eligibility, pricing, payment, certification, public ranking, or staffing decisions.
7. Whether cached pages, AJAX, spam controls, or consent settings may affect data collection.

## Workflow choices

### Survey

Use Survey workflows for customer satisfaction, employee feedback, market research, post-purchase feedback, event feedback, and internal questionnaires.

Safe defaults:

- Prefer non-identifying survey questions unless follow-up is explicitly required.
- Use visible labels and plain-language scale descriptions.
- Keep Likert scale direction consistent.
- Avoid mixing anonymous and identified questions without clear consent.
- Do not promise front-end summary results unless the implementation path supports it.
- If summary export is requested, explain whether the active tool can export entries versus summary charts.

Survey add-on checks:

- Confirm Survey Add-On active before using Survey fields.
- Survey field can support Survey field types such as Likert, Rank, Rating, Radio Buttons, Checkboxes, Single Line Text, Paragraph Text, or Drop Down.
- Survey results are accessed through the Results area and can be filtered by fields or submission metadata.
- Treat result calculations as dependent on current entries. If entries are edited after submission, aggregate results can change.

### Poll

Use Poll workflows for lightweight audience interaction, editorial polls, campaign feedback, and quick preference voting.

Safe defaults:

- Confirm Polls Add-On active before using Poll fields, Poll block, Poll widget, or poll shortcodes.
- Decide whether results are shown to visitors, shown after submission, hidden, or internal-only.
- Warn that public results can influence later votes.
- Avoid using public polls for high-stakes decision-making unless anti-abuse, authentication, and data-quality controls are separately approved.
- Do not reset poll results without explicit approval and export/backup notes.

Poll presentation checks:

- Prefer the Poll block where the site uses the block editor and all required controls are available.
- Use standard Gravity Forms embeds only when poll-specific display requirements are not needed.
- Validate result visibility, duplicate embed risk, cache behaviour, and spam controls.

### Quiz

Use Quiz workflows for knowledge checks, training checks, onboarding tests, lightweight scoring, and internal assessments.

Safe defaults:

- Confirm Quiz Add-On active before using Quiz fields, quiz settings, quiz merge tags, scoring, pass/fail, letter grades, or quiz results.
- Do not use instant feedback for critical tests because answers cannot be changed after selection and the official docs position it for training/trivial quizzes.
- Treat scoring changes as high risk because past results may be recalculated when viewed after correct answers or weighted scores are changed.
- Test every branch and scoring boundary before launch.
- Do not claim secure proctoring, exam integrity, certification compliance, or anti-cheating controls without a separate approved system.

Quiz scoring checks:

- Normal scoring: correct answers count as 1 and incorrect answers as 0.
- Weighted scoring: answer values can change the score and may include negative scores.
- Hidden quiz questions still count as incorrect when hidden by conditional logic.
- Multiple-correct checkbox questions require all correct choices for the answer summary to show correct.
- Quiz percentage score floors at 0 percent.
- Changing correct answers or weighted scores can change displayed historical results because results are dynamically calculated.

## Common risk patterns

### Anonymous feedback

A survey is not anonymous if it collects names, email addresses, IP addresses, user IDs, order IDs, hidden CRM IDs, UTM IDs tied to identities, or if entries are linked to logged-in users. Mark as pseudonymous or identified unless anonymity is verified end to end.

### Public results

Public results require approval for:

- Whether results are shown before or after voting.
- Whether result visibility affects behaviour.
- Whether counts, percentages, and labels are safe to show.
- Whether cache/CDN layers delay or stale-display results.
- Whether reset/clear actions are needed.

### Scoring and eligibility

Treat assessment scores as high risk when they determine eligibility, access, pricing, employment, certification, or support priority. Use draft-only planning unless operational/legal requirements are confirmed.

### Results export and reporting

Do not invent reporting exports. If summary exports are unavailable, recommend entry export and external analysis. Separate Gravity Forms entry data from aggregate add-on result screens.

## Recommended output selection

- Use `templates/assessment-plan.md` for new survey, poll, quiz, assessment, feedback, or scoring forms.
- Use `templates/results-review.md` for existing survey/poll/quiz results, reporting, result visibility, scoring changes, or reset/export questions.
- Use `templates/risk-review.md` when results are high-stakes or tied to personal, employment, eligibility, or payment outcomes.
- Use `templates/test-report.md` after validation submissions.

## Test checklist

1. Submit a normal case.
2. Submit empty/required-field case.
3. Submit spam-like case.
4. Test anonymous/identified state.
5. Test confirmation text and merge tags.
6. Test notification content does not expose sensitive results unexpectedly.
7. Test Survey/Poll/Quiz result view access.
8. Test filters/date ranges where reporting matters.
9. Test public result display if used.
10. Test scoring boundaries, pass/fail threshold, letter grade thresholds, weighted scoring, hidden conditional quiz questions, and reset/export path when applicable.
