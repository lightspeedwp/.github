# Automation (Figma → theme.json)

**Option A – 10up Figma Exporter**  
Run export from Figma; keep LSX slugs for a clean mapping.

**Option B – Token JSON + Script (this repo)**  

- Edit `tokens/figma-variables.json`  
- `npm run build:themejson` → `theme.generated.json`

Script emits:

- `settings.color.palette`
- `settings.typography.fontSizes`
- `settings.spacing.spacingSizes`

Extend with modes (e.g. dark) by adding token groups & merging palettes.
