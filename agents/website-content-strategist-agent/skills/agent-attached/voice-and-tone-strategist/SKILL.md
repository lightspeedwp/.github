---
name: voice-and-tone-strategist
description: Define, refine, or apply brand voice and tone systems for websites, pages, newsletters, forms, responder emails, and structured content. Use when a user needs clearer brand personality, content tone rules, messaging guardrails, or reusable voice defaults before drafting.
---

# Voice and Tone Strategist

## When to use this skill

Use this skill when the request depends on brand personality, editorial style, messaging guardrails, or reusable voice defaults that should shape later content work.

Typical use cases:

- define a brand voice and tone system for a new website project
- refine existing brand voice into copy-ready guidance
- align pages, newsletters, forms, or responder content with a consistent personality
- turn scattered positioning notes into reusable tone rules
- identify where tone should vary by audience, page type, or conversion stage without losing brand consistency

Do not use this skill when the brand voice is already well defined and the task is only normal drafting, review, or formatting.

## Core rule

This is a difficult strategy area. Do not guess a final brand voice too early.

When key answers are missing, keep asking focused follow-up questions until there is enough information to define:

- the brand personality baseline
- the core tone pillars
- the main tone boundaries
- the preferred and avoided wording
- any meaningful tone shifts by context

Use smart defaults to reduce friction, but do not silently decide the final voice system on the user's behalf.

## Guided intake workflow

1. Identify whether the user needs:
   - a brand-new voice system
   - a refinement of an existing voice system
   - application guidance for a current project
2. Collect the smallest useful foundation first:
   - brand personality
   - target audience
   - market position or differentiator
   - trust requirements
   - preferred and avoided language
3. If any of those are unclear, present compact options and ask the user to choose or refine them.
4. Separate stable voice rules from situational tone shifts.
5. Do not move to final guidance until the foundation is strong enough to support real drafting decisions.
6. Return a clean strategy output plus the clearest next handoff.

## Smart defaults and option-led guidance

When the user is unsure, present 3 to 5 concise options drawn from `references/voice-tone-options.md` and recommend the closest working default based on the project context.

Use recommendation language like:

- "The closest working default looks like..."
- "If you want a safer starting point, choose..."
- "If you want a stronger premium or expert feel, choose..."

Good option groups include:

- personality direction
- tone intensity
- trust style
- sales pressure level
- editorial formality
- wording to avoid

For likely site scenarios, use `references/voice-tone-scenario-defaults.md` to suggest a starting direction, but always leave the final choice with the user.

## Question discipline

Ask more questions only when the missing answer changes real drafting decisions.

Prioritise questions in this order:

1. brand personality baseline
2. audience impression to create
3. tone boundaries and trust requirements
4. preferred and avoided wording
5. tone shifts by page type, funnel stage, or audience context

If the user answers vaguely, translate that vague answer into concise options and ask for a choice.

## Memory use

When reusable voice defaults are confirmed, store them in Memory using the project files described in the agent instructions.

Persist only stable voice defaults that should affect future related work, such as:

- brand personality summary
- core tone pillars
- wording to prefer or avoid
- tone shifts by page or campaign type
- trust and proof sensitivity notes
- sales-pressure boundaries
- formality level

Use project Memory for project-level voice defaults and update existing values instead of creating conflicting duplicates.

Do not store temporary brainstorming notes, speculative descriptors, one-off copy experiments, or unconfirmed style ideas as durable Memory.

## Completion threshold

Do not treat voice intake as complete until you have enough to define:

- a one- or two-sentence brand voice summary
- 3 core tone pillars
- preferred wording guidance
- avoided wording guidance
- at least one note on trust or claim sensitivity

If those pieces are not yet clear, ask another focused question.

## Output

Return these sections when relevant:

- Brand voice summary
- Core tone pillars
- Tone by context
- Preferred wording and avoided wording
- Trust, proof, and claim sensitivity notes
- Working defaults to store in Memory
- Recommended next step for drafting or review

## Supporting Files

- `references/voice-tone-output-template.md` — default output structure.
- `references/voice-tone-intake-checklist.md` — minimum and follow-up intake fields.
- `references/voice-tone-options.md` — compact option menus to present when the user is unsure.
- `references/voice-tone-scenario-defaults.md` — suggested starting defaults by common site scenario.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
