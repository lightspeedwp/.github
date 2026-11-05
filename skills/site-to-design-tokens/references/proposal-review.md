# Reviewing the proposal

`proposal.md` is written for the person who approves the tokens. Walk through it in this order.

## Summary

The anchors, how many live colours match a token exactly or nearly, how many contrast pairs pass, and the fonts found.

## Decisions for the reviewer

Each item needs an answer before approval:

- **Confirm each family's anchor.** Each line gives the live colour, its step, and where the site uses it. To change one, re-run `propose-tokens.ts` with `--assign brand=#hex` (or `primary`, `cta`).
- **Generated placeholders.** When the site has no colour for a family, a placeholder is generated. Ask the reviewer for the real colour.
- **Merged sizes.** The type scale has 8 steps. Extra sizes are merged into their nearest neighbour, and smaller sizes share `Tiny`. Check that nothing important was merged.
- **Kept defaults.** A semantic role whose live colour was unreadable on the page keeps its TSP default.

## Colour primitives

The four ramps. The anchor step holds the live value. Other steps are generated, unless a site colour fit the ramp and replaced one (each replacement is listed in the decisions). Light steps (100 to 300) are for surfaces, and steps of 600 and above are usually safe for text on white. The contrast table confirms which are.

## Semantic tokens

Each role, its primitive and its value, with `site: …` when it came from the live site. Compare these with how the site actually behaves: link and hover colours, button fills and text, input borders, and alternate section backgrounds.

## Live colours to tokens

The 40 most used live colours with their nearest token:

| Match | Means                                | Action                                                                                                       |
| ----- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| exact | Identical, or a difference below 0.5 | None                                                                                                         |
| near  | A small visible difference, below 6  | Accept, or move the token if the colour is important                                                         |
| none  | No close token                       | Decide whether it's a one-off (accept the nearest role token) or needs a new primitive (reviewer's approval) |

## Contrast

WCAG 2.2 ratios for the semantic pairs. Text needs 4.5:1, and focus rings and input borders need 3:1. For a failing pair, suggest the nearest step that passes (for example, `action/primary/background` from `primary-500` to `primary-600`), and update the proposal by re-running with `--assign`, or by editing the token in `proposal.json` and noting the change.

## Typography, spacing, radius, shadows and layout

Check each scale against the site at both widths:

- The body text size should be `xSmall`.
- Heading sizes should shrink on mobile.
- Section spacing should reflect what the eye sees. Sites that space sections with margins on unstyled wrappers can produce a smaller scale than the design intends, so say so and let the reviewer set the larger steps.
- Font names come from the site's CSS (for example a web font alias such as `argesta_displayregular`). Ask the reviewer for the licensed family name and its fallback.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
