/**
 * Token reference checks. Preset references reuse the theme-orphaned-refs skill's loader and
 * suggester, so the two skills always agree on what an orphan is and what to replace it with.
 */
import {
  PRESET_TYPES,
  type PresetRegistry,
  PresetRegistryLoader,
  type PresetType,
  SlugSuggester,
} from '../../../../theme-orphaned-refs/scripts/find-orphaned-presets';
import { lineAt, walkJson } from '../text';
import type { Finding, Theme, ThemeFile } from '../types';
import { BaseCheck } from './base-check';

const JSON_PRESET = /var:preset\|([a-z-]+)\|([a-zA-Z0-9-]+)/g;
const CSS_PRESET = /--wp--preset--([a-z]+(?:-[a-z]+)*)--([a-zA-Z0-9-]+)/g;
const JSON_CUSTOM = /var:custom\|([a-zA-Z0-9|-]+)/g;
const CSS_CUSTOM = /--wp--custom--([a-z0-9-]+?(?:--[a-z0-9-]+)*)(?=[\s,;)}"'\\]|$)/g;

/** Files whose text may reference tokens. */
function sources(theme: Theme): ThemeFile[] {
  return [
    ...(theme.themeJson ? [theme.themeJson] : []),
    ...theme.partials,
    ...theme.templates,
    ...theme.parts,
    ...theme.patterns,
  ];
}

/** theme.json and style variations: a variation may define slugs of its own. */
function settingsFiles(theme: Theme): ThemeFile[] {
  return [...(theme.themeJson ? [theme.themeJson] : []), ...theme.partials].filter((f) => {
    try {
      JSON.parse(f.text);
      return true;
    } catch {
      return false;
    }
  });
}

export class OrphanedPresetCheck extends BaseCheck {
  readonly id = 'tokens/orphaned-preset';
  readonly severity = 'error' as const;
  readonly description =
    'Every var:preset|… and --wp--preset--… reference resolves to a defined slug.';

  constructor(private readonly suggester = new SlugSuggester()) {
    super();
  }

  run(theme: Theme): Finding[] {
    const registry = this.registry(theme);
    const out: Finding[] = [];
    for (const file of sources(theme)) {
      for (const pattern of [JSON_PRESET, CSS_PRESET]) {
        for (const match of file.text.matchAll(pattern)) {
          const [ref, type, slug] = match;
          if (
            !(PRESET_TYPES as readonly string[]).includes(type) ||
            registry[type as PresetType].includes(slug)
          ) {
            continue;
          }
          const suggestion = this.suggester.suggest(
            slug,
            type as PresetType,
            registry[type as PresetType]
          );
          out.push(
            this.finding(
              file.path,
              `${ref} is not defined in theme.json.`,
              suggestion !== slug
                ? `Use "${suggestion}" (or run theme-orphaned-refs).`
                : `Define the ${type} preset "${slug}" or remove the reference.`,
              {
                line: lineAt(file.text, match.index ?? 0),
              }
            )
          );
        }
      }
    }
    return out;
  }

  private registry(theme: Theme): PresetRegistry {
    const loader = new PresetRegistryLoader();
    const merged = Object.fromEntries(
      PRESET_TYPES.map((t) => [t, [] as string[]])
    ) as unknown as PresetRegistry;
    for (const file of settingsFiles(theme)) {
      const loaded = loader.load(file.text);
      for (const type of PRESET_TYPES) {
        merged[type].push(...loaded[type]);
      }
    }
    return merged;
  }
}

/** WordPress turns custom keys into CSS names: fontWeight → font-weight. */
const kebab = (key: string): string => key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export class OrphanedCustomCheck extends BaseCheck {
  readonly id = 'tokens/orphaned-custom';
  readonly severity = 'error' as const;
  readonly description =
    'Every var:custom|… and --wp--custom--… reference resolves to a settings.custom value.';

  run(theme: Theme): Finding[] {
    const defined = this.defined(theme);
    const out: Finding[] = [];
    for (const file of sources(theme)) {
      for (const [pattern, toPath] of [
        [JSON_CUSTOM, (p: string) => p.split('|').map(kebab).join('--')],
        [CSS_CUSTOM, (p: string) => p],
      ] as const) {
        for (const match of file.text.matchAll(pattern)) {
          if (!defined.has(toPath(match[1]))) {
            out.push(
              this.finding(
                file.path,
                `${match[0]} has no matching settings.custom value.`,
                'Define it under settings.custom in theme.json, or use an existing custom token.',
                {
                  line: lineAt(file.text, match.index ?? 0),
                }
              )
            );
          }
        }
      }
    }
    return out;
  }

  private defined(theme: Theme): Set<string> {
    const paths = new Set<string>();
    for (const file of settingsFiles(theme)) {
      const custom = (JSON.parse(file.text) as { settings?: { custom?: unknown } }).settings
        ?.custom;
      walkJson(custom, (_key, value, path) => {
        if (value === null || typeof value !== 'object') {
          paths.add(path.map(kebab).join('--'));
        }
      });
    }
    return paths;
  }
}
