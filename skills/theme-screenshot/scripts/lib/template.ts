import type { ScreenshotColours } from './palette';

export const SCREENSHOT_WIDTH = 1200;
export const SCREENSHOT_HEIGHT = 900;

export const LOGO_MAX_WIDTH = 560;
export const LOGO_MAX_HEIGHT = 300;

export interface LogoMeasure {
  width: number;
  height: number;
  /** Mean luminance of the visible pixels, 0 (black) to 1 (white). */
  luminance: number;
}

export interface LogoSize {
  width: number;
  height: number;
}

/**
 * Scales the logo to fit the 560 x 300 box, keeping its shape. A vector logo may grow to
 * fill the box. A raster logo is never enlarged, because that blurs it.
 */
export function fitLogo(measure: Pick<LogoMeasure, 'width' | 'height'>, vector: boolean): LogoSize {
  if (!measure.width || !measure.height) {
    return { width: LOGO_MAX_WIDTH, height: LOGO_MAX_HEIGHT };
  }
  let scale = Math.min(LOGO_MAX_WIDTH / measure.width, LOGO_MAX_HEIGHT / measure.height);
  if (!vector) {
    scale = Math.min(scale, 1);
  }
  return {
    width: Math.round(measure.width * scale),
    height: Math.round(measure.height * scale),
  };
}

export interface TemplateInput {
  logoDataUri: string;
  logoSize: LogoSize;
  colours: ScreenshotColours;
  /** For example "Tour operator". Shown in spaced capitals. */
  industry: string;
  year: number;
  /** The line under the industry, before the year. */
  label: string;
}

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Renders the 1200 x 900 theme screenshot as HTML. */
export class ScreenshotTemplate {
  render(input: TemplateInput): string {
    const { colours: c } = input;
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${SCREENSHOT_WIDTH}px; height: ${SCREENSHOT_HEIGHT}px; overflow: hidden; }
  body {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at 50% 45%, ${c.centre} 0%, ${c.edge} 100%);
  }
  .logo { width: ${input.logoSize.width}px; height: ${input.logoSize.height}px; object-fit: contain; }
  .divider {
    width: 170px; height: 2px; margin: 56px 0 46px;
    background: linear-gradient(90deg, transparent, ${c.accent}, transparent);
  }
  .industry {
    font: 400 30px/1.2 Optima, Candara, "Gill Sans", "Trebuchet MS", sans-serif;
    letter-spacing: 0.42em; text-indent: 0.42em; text-transform: uppercase; color: ${c.industry};
  }
  .label {
    margin-top: 30px;
    font: 400 15px/1.2 "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.3em; text-indent: 0.3em; text-transform: uppercase; color: ${c.label};
  }
</style>
</head>
<body>
  <img class="logo" src="${input.logoDataUri}" alt="">
  <div class="divider"></div>
  <p class="industry">${escapeHtml(input.industry)}</p>
  <p class="label">${escapeHtml(input.label)} &middot; ${input.year}</p>
</body>
</html>
`;
  }
}
