/**
 * theme.json checks: schema validity, duplicate slugs, declared templates and parts.
 */
import Ajv from 'ajv';
import { lineOfPath } from '../text';
import type { Finding, JsonFile, Theme } from '../types';
import { BaseCheck } from './base-check';

type JsonObject = Record<string, unknown>;

/** Supplies a JSON schema for a theme.json `$schema` URL, or undefined when none is available. */
export interface SchemaSource {
  load(url: string): JsonObject | undefined;
}

/** Ajv messages that only restate an error already reported in a oneOf/anyOf branch. */
const BRANCH_NOISE =
  /must match (exactly one schema in oneOf|a schema in anyOf|"then" schema)|must be equal to one of the allowed values/;

export class ThemeJsonSchemaCheck extends BaseCheck {
  readonly id = 'theme-json/schema';
  readonly severity = 'error' as const;
  readonly description =
    'theme.json and every styles/ partial parse and validate against their $schema.';

  private readonly validators = new Map<
    string,
    ((data: unknown) => boolean) & { errors?: unknown }
  >();

  constructor(private readonly schemas: SchemaSource) {
    super();
  }

  run(theme: Theme): Finding[] {
    if (!theme.themeJson) {
      return [
        this.finding(
          'theme.json',
          'theme.json is missing.',
          'Add a theme.json: block themes take their settings and styles from it.'
        ),
      ];
    }
    return [theme.themeJson, ...theme.partials].flatMap((file) => this.validate(file));
  }

  private validate(file: JsonFile): Finding[] {
    if (file.json === undefined) {
      return [
        this.finding(file.path, `Not valid JSON: ${file.parseError}`, 'Fix the JSON syntax.'),
      ];
    }
    const url = (file.json as JsonObject).$schema;
    if (typeof url !== 'string') {
      return [
        this.finding(
          file.path,
          'No $schema.',
          'Add "$schema": "https://schemas.wp.org/wp/<version>/theme.json" for the WordPress floor.'
        ),
      ];
    }
    const validate = this.validator(url);
    if (!validate) {
      return [
        {
          ...this.finding(
            file.path,
            `No bundled schema for ${url}, so the file was not validated.`,
            'Pass --schema <file> with a pinned copy, or bundle the version in scripts/schemas/.'
          ),
          severity: 'warning',
        },
      ];
    }
    if (validate(file.json)) {
      return [];
    }
    const errors = (validate.errors ?? []) as { instancePath: string; message?: string }[];
    return errors
      .filter((e) => !BRANCH_NOISE.test(e.message ?? ''))
      .map((e) => {
        const path = e.instancePath.split('/').filter(Boolean);
        return this.finding(
          file.path,
          `${e.instancePath || '(root)'} ${e.message}`,
          'Match the theme.json schema for this WordPress version.',
          {
            line: lineOfPath(file.text, path),
            path: path.join('.') || undefined,
          }
        );
      });
  }

  private validator(
    url: string
  ): (((data: unknown) => boolean) & { errors?: unknown }) | undefined {
    if (!this.validators.has(url)) {
      const schema = this.schemas.load(url);
      if (!schema) {
        return undefined;
      }
      const copy = { ...schema };
      delete copy.$schema;
      this.validators.set(
        url,
        new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(copy)
      );
    }
    return this.validators.get(url);
  }
}

/** Preset lists whose slugs must be unique. */
const PRESET_LISTS: [string, string][] = [
  ['color', 'palette'],
  ['color', 'gradients'],
  ['color', 'duotone'],
  ['typography', 'fontSizes'],
  ['typography', 'fontFamilies'],
  ['spacing', 'spacingSizes'],
  ['shadow', 'presets'],
  ['border', 'radiusSizes'],
];

export class DuplicateSlugCheck extends BaseCheck {
  readonly id = 'theme-json/duplicate-slug';
  readonly severity = 'error' as const;
  readonly description = 'No preset slug is defined twice in the same list.';

  run(theme: Theme): Finding[] {
    return [theme.themeJson, ...theme.partials].flatMap((file) => {
      const settings = ((file?.json as JsonObject | undefined)?.settings ?? {}) as JsonObject;
      return PRESET_LISTS.flatMap(([group, key]) => {
        const list = ((settings[group] ?? {}) as JsonObject)[key];
        if (!Array.isArray(list)) {
          return [];
        }
        const seen = new Set<string>();
        const out: Finding[] = [];
        for (const entry of list) {
          const slug = (entry as JsonObject | null)?.slug;
          if (typeof slug !== 'string') {
            continue;
          }
          if (seen.has(slug)) {
            out.push(
              this.finding(
                file!.path,
                `settings.${group}.${key} defines "${slug}" more than once.`,
                'Remove or rename the duplicate; the later entry silently wins.',
                {
                  path: `settings.${group}.${key}`,
                  line: lineOfPath(file!.text, ['settings', group, key]),
                }
              )
            );
          }
          seen.add(slug);
        }
        return out;
      });
    });
  }
}

export class DeclaredFilesCheck extends BaseCheck {
  readonly id = 'theme-json/declared-files';
  readonly severity = 'error' as const;
  readonly description =
    'Every customTemplates and templateParts entry in theme.json has its file.';

  run(theme: Theme): Finding[] {
    const json = (theme.themeJson?.json ?? {}) as JsonObject;
    const has = (folder: string, name: string): boolean =>
      [...theme.templates, ...theme.parts].some((f) => f.path === `${folder}/${name}.html`);
    const out: Finding[] = [];
    for (const [key, folder] of [
      ['customTemplates', 'templates'],
      ['templateParts', 'parts'],
    ] as const) {
      const list = json[key];
      for (const entry of Array.isArray(list) ? list : []) {
        const name = (entry as JsonObject | null)?.name;
        if (typeof name === 'string' && !has(folder, name)) {
          out.push(
            this.finding(
              'theme.json',
              `${key} declares "${name}" but ${folder}/${name}.html does not exist.`,
              `Add ${folder}/${name}.html or remove the entry.`,
              {
                path: key,
                line: lineOfPath(theme.themeJson!.text, [key]),
              }
            )
          );
        }
      }
    }
    return out;
  }
}

export class UndeclaredPartCheck extends BaseCheck {
  readonly id = 'theme-json/undeclared-part';
  readonly severity = 'warning' as const;
  readonly description =
    'Every parts/ file is declared in theme.json templateParts, so it has a title and area.';

  run(theme: Theme): Finding[] {
    const list = ((theme.themeJson?.json ?? {}) as JsonObject).templateParts;
    const declared = new Set(
      (Array.isArray(list) ? list : []).map((e) => (e as JsonObject | null)?.name)
    );
    return theme.parts
      .filter((part) => !declared.has(part.path.replace(/^parts\/|\.html$/g, '')))
      .map((part) =>
        this.finding(
          part.path,
          'This part is not declared in theme.json templateParts.',
          'Add { "name", "title", "area" } to templateParts so the Site Editor labels and places it.'
        )
      );
  }
}
