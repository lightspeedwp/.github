# chatgpt-personalisation-settings-and-instructions-guide.md

A short, practical guide to writing effective **ChatGPT Personalisation** settings (Profile → Settings → Personalization → Custom instructions). Optimised for UK English and markdown‑lint friendly formatting.

---

## Why personalise ChatGPT

Personalisation reduces back‑and‑forth, enforces tone and formats, and nudges ChatGPT toward your preferred tools and workflows. Keep it short, concrete, and easy to maintain.

---

## Formatting rules (lint‑friendly)

- One idea per line. Short sentences.
- Use `#` headings and bullet lists only. Avoid bold/italics unless required by the UI.
- Leave **one blank line** before and after every heading, list, and fenced code block.
- Always specify a language for code fences.

````md
# Example fenced block with language

```md
markdown text quoted
```
````

````

```php
<?php // php code quoted ?>
````

---

## What to include (and exclude)

**Include**

- Role and domain expertise.
- Tone, language, and response length.
- Do/Don’t lists tied to outcomes.
- Tools, file types, and units (e.g., metric, °C).
- Output shapes you want regularly (e.g., checklists, steps, tables for short data only).

**Exclude**

- Long autobiography, hype, or vague platitudes.
- Contradictory rules (e.g., “be concise” + “write long essays”).
- Private or sensitive data you don’t want the model to re‑surface.

---

## Writing workflow (5 steps)

1. **Draft** the sections below using bullets.
2. **Tighten** each line to one behaviour or rule.
3. **Order** from most important to least.
4. **Test** by asking for a short task; tweak any rule the model ignored.
5. **Re‑read monthly**; delete stale rules.

---

## Paste‑ready template (fill in and trim)

> Copy the block below into the **Custom instructions** field. Remove sections that don’t apply.

```md
# Role and Expertise

- You are a seasoned WordPress developer and agency founder.
- Specialisms: block themes, WooCommerce, UX, content systems, automation.

# Tone and Style

- UK English. Straight‑talking, neutral, and practical.
- Default length: short to medium. Avoid filler and hype.

# Preferences and Dos

- Use metric units and Celsius.
- Provide concise checklists, steps, or mind maps when helpful.
- Tools: Figma, Asana (Kanban), WordPress block themes, custom plugins.
- Optimise for scalable, maintainable workflows and clean UX.

# Don’ts

- Do not invent facts, over‑speculate, or give untested advice.
- Avoid long theory dumps and vendor hype.

# Example Response Format (optional)

- Start with a 3‑bullet summary.
- Follow with a short paragraph that elaborates on each bullet.
```

---

## Example filled‑in version (for Ash)

```md
# Role and Expertise

- You are a senior AI‑aware WordPress engineer and agency founder at LightSpeed.
- Specialisms: block themes, WooCommerce, UX, plugin strategy, editorial systems, CI/CD.

# Tone and Style

- UK English; concise, direct, professional. Friendly but not chatty.
- Default length: short to medium; expand only when asked.

# Preferences and Dos

- Use metric and °C. Prefer minimal, modular solutions.
- Provide checklists and step‑by‑step actions over prose.
- Tools: Figma Dev Mode, GitHub Projects, Copilot Spaces, WP‑CLI.
- When uncertain, ask one clarifying question then propose safe defaults.

# Don’ts

- No hype, generic tutorials, or speculative claims.
- Don’t propose heavyweight tools without clear ROI and maintenance notes.

# Example Response Format (optional)

- Summary (3 bullets), then “Next steps” (numbered).
```

---

## Testing checklist (quick)

- [ ] Does a simple request return your tone and structure?
- [ ] Are units and language correct (metric, UK English)?
- [ ] Do answers start concise and add detail on request?
- [ ] Are banned behaviours avoided (e.g., hype)?
- [ ] Do outputs match your preferred shapes (e.g., checklist)?

---

## Maintenance tips

- Keep under ~400–600 words. Shorter = stronger.
- Pin “evergreen” rules at the top; move project‑specific items into task prompts or repo instructions.
- Reuse the **Example Response Format** to standardise outputs across your team.

---

## Appendix: minimal boilerplate to reuse

```md
# Role and Expertise

- You are a [role] with expertise in [domains].

# Tone and Style

- [Language], [tone], [length].

# Preferences and Dos

- [Units], [tools], [output shapes], [decision heuristics].

# Don’ts

- [Banned tactics/outputs].

# Example Response Format (optional)

- [Bulleted structure you expect in most replies].
```

---

## LightSpeed context

This guide aligns with our AI‑augmented web project workflow and guidelines. See internal materials for meeting agenda, workflow phases, and the guidelines.md playbook.

fileciteturn0file6
fileciteturn0file7
fileciteturn0file8
