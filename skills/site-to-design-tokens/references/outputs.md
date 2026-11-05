# Outputs

`write-token-export.ts` turns an approved `proposal.json` into two files. Both come from the same plan, so Figma and `theme.json` stay in step.

## Figma variables (`--figma-script`)

Spacing and type sizes are created in ascending order (`None` first for spacing), so the Variables panel reads as a ramp. See [target-structure.md](target-structure.md).

A `use_figma` script that creates the seven collections, their modes, variables, values, aliases, scopes and code syntax, and the `LSX/*` effect styles.

1. Confirm the target Figma file with the user, usually the project's design system library. Writes to it need the reviewer's approval.
2. Load `figma-use`, and `figma-generate-library` because this creates a token library.
3. Run a read-only `use_figma` call to list the existing variable collections and effect styles.
4. Run the script through `use_figma`. It checks for clashes first, and stops without changes if any collection or effect style with the same name exists. To refresh an existing file, update its variables by hand with `figma-use`, or remove the old collections with the owner's agreement.
5. Report the returned collection IDs, variable count and effect style IDs.

The script must stay under the `use_figma` limit of 50,000 characters. The writer refuses larger plans, which only happens with unusually many shadows or sizes.

## Variables export (`--export`)

JSON in the shape `figma-to-block-theme` reads from its Figma export, so a theme can be built without Figma:

```bash
npx tsx <figma-to-block-theme>/scripts/figma-variables-to-theme-json.ts variables.json --out mapped.json
```

Then follow that skill's Tokens mode from "Review each family". Expected mapper notes:

- Layout widths and breakpoints arrive under `settings.custom`. Copy the widths to `settings.layout.contentSize` and `wideSize` in `theme.json`.
- Font families get `sans-serif` as their fallback. Pass `--font-fallback serif` when the body font is a serif, and correct the heading stack by hand.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
