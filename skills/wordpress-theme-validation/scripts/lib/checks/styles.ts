/**
 * Style checks for theme.json `styles` and the `styles/` partials. The engine traps here
 * (pseudo-state keys, @media in css fields) were proven on WordPress 7.1.
 */
import { type CssField, cssFields, lineOfPath, stylesOf, walkJson } from '../text';
import type { Finding, JsonFile, Theme } from '../types';
import { BaseCheck } from './base-check';

interface FileField extends CssField {
  file: JsonFile;
}

/** Every css field in theme.json and the partials. */
function allCss(theme: Theme, { skipRoot = false } = {}): FileField[] {
  return [theme.themeJson, ...theme.partials].flatMap((file) =>
    file?.json === undefined
      ? []
      : cssFields(stylesOf(file.json))
          .filter(
            ({ path }) => !(skipRoot && file === theme.themeJson && path.join('.') === 'styles.css')
          )
          .map((field) => ({ ...field, file }))
  );
}

/** Every string value in the styles trees, with its path. */
function allStyleStrings(
  theme: Theme
): { file: JsonFile; path: string[]; key: string; value: string }[] {
  const out: { file: JsonFile; path: string[]; key: string; value: string }[] = [];
  for (const file of [theme.themeJson, ...theme.partials]) {
    if (file?.json === undefined) {
      continue;
    }
    walkJson(stylesOf(file.json), (key, value, path) => {
      if (typeof value === 'string') {
        out.push({ file, path: ['styles', ...path], key, value });
      }
    });
  }
  return out;
}

export class PseudoStateKeyCheck extends BaseCheck {
  readonly id = 'styles/pseudo-state-key';
  readonly severity = 'error' as const;
  readonly description =
    'styles/ partials use no JSON pseudo-state keys (WordPress drops them silently).';

  run(theme: Theme): Finding[] {
    const out: Finding[] = [];
    for (const file of theme.partials) {
      walkJson(stylesOf(file.json), (key, _value, path) => {
        if (key.startsWith(':')) {
          const full = ['styles', ...path];
          out.push(
            this.finding(
              file.path,
              `"${key}" is ignored in a style partial.`,
              `Move the state into the css field: "&${key} { … }".`,
              {
                path: full.join('.'),
                line: lineOfPath(file.text, full),
              }
            )
          );
        }
      });
    }
    return out;
  }
}

export class MediaInCssCheck extends BaseCheck {
  readonly id = 'styles/media-in-css';
  readonly severity = 'error' as const;
  readonly description =
    'No @media inside block, element or variation css fields (WordPress flattens it).';

  run(theme: Theme): Finding[] {
    return allCss(theme, { skipRoot: true })
      .filter(({ css }) => /@media/.test(css))
      .map(({ file, path }) =>
        this.finding(
          file.path,
          '@media inside a css field is flattened, so the rule applies at every width.',
          'Move the media query to the root styles.css or an enqueued stylesheet.',
          {
            path: path.join('.'),
            line: lineOfPath(file.text, path),
          }
        )
      );
  }
}

export class RawPxCheck extends BaseCheck {
  readonly id = 'styles/raw-px';
  readonly severity = 'warning' as const;
  readonly description = 'css fields use spacing, size and custom tokens instead of raw px.';

  run(theme: Theme): Finding[] {
    return allCss(theme).flatMap(({ file, path, css }) =>
      (css.match(/(?<![\w-])\d*\.?\d+px\b/g) ?? []).map((px) =>
        this.finding(
          file.path,
          `Raw ${px} in a css field.`,
          'Use a var(--wp--preset--…) or var(--wp--custom--…) token.',
          {
            path: path.join('.'),
            line: lineOfPath(file.text, path),
          }
        )
      )
    );
  }
}

export class RawHexCheck extends BaseCheck {
  readonly id = 'styles/raw-hex';
  readonly severity = 'warning' as const;
  readonly description = 'Styles use palette tokens, not raw hex colours.';

  run(theme: Theme): Finding[] {
    return allStyleStrings(theme)
      .filter(({ value }) => /#[0-9a-f]{3,8}\b/i.test(value))
      .map(({ file, path, value }) =>
        this.finding(
          file.path,
          `Raw colour ${value.match(/#[0-9a-f]{3,8}\b/i)![0]}.`,
          'Use var:preset|color|<slug> or var(--wp--preset--color--<slug>).',
          {
            path: path.join('.'),
            line: lineOfPath(file.text, path),
          }
        )
      );
  }
}

export class RawFontFamilyCheck extends BaseCheck {
  readonly id = 'styles/raw-font-family';
  readonly severity = 'warning' as const;
  readonly description = 'fontFamily values in styles use font-family presets, not font names.';

  run(theme: Theme): Finding[] {
    return allStyleStrings(theme)
      .filter(
        ({ key, value }) => key === 'fontFamily' && !/^var[:(]/.test(value) && value !== 'inherit'
      )
      .map(({ file, path, value }) =>
        this.finding(
          file.path,
          `fontFamily is the literal "${value}".`,
          'Use var:preset|font-family|<slug>.',
          {
            path: path.join('.'),
            line: lineOfPath(file.text, path),
          }
        )
      );
  }
}

export class ImportantCheck extends BaseCheck {
  readonly id = 'styles/important';
  readonly severity = 'error' as const;
  readonly description = '!important appears only where the allow-list records it as debt.';

  run(theme: Theme): Finding[] {
    return allCss(theme).flatMap(({ file, path, css }) =>
      (css.match(/!important/g) ?? []).map(() =>
        this.finding(
          file.path,
          '!important in a css field.',
          'Fix the cascade (specificity, block supports) instead; record unavoidable cases in .theme-validation.json.',
          {
            path: path.join('.'),
            line: lineOfPath(file.text, path),
          }
        )
      )
    );
  }
}
