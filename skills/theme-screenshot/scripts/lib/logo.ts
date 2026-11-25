import { extname } from 'node:path';

/** Network access, so tests never touch the network. */
export interface Fetcher {
  text(url: string): Promise<string>;
  bytes(url: string): Promise<{ data: Buffer; type: string }>;
}

/** File access, so tests never touch real files. */
export interface FileReader {
  read(path: string): Buffer;
}

export type LogoSource = 'file' | 'custom-logo' | 'header-logo' | 'og:image';

export interface FoundLogo {
  url: string;
  source: Exclude<LogoSource, 'file'>;
}

export interface LoadedLogo {
  dataUri: string;
  source: LogoSource;
  /** The file path or URL the logo came from. */
  origin: string;
}

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

/** Finds a site's logo in its home page HTML: custom logo, header logo, then og:image. */
export class LogoLocator {
  find(html: string, pageUrl: string): FoundLogo | undefined {
    const attempts: Array<[FoundLogo['source'], string | undefined]> = [
      ['custom-logo', this.customLogo(html)],
      ['header-logo', this.headerLogo(html)],
      ['og:image', this.ogImage(html)],
    ];
    for (const [source, raw] of attempts) {
      const url = raw ? this.resolve(raw, pageUrl) : undefined;
      if (url) {
        return { url, source };
      }
    }
    return undefined;
  }

  private attr(tag: string, name: string): string | undefined {
    return tag
      .match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))
      ?.slice(1)
      .find(Boolean);
  }

  private images(html: string): string[] {
    return html.match(/<img\b[^>]*>/gi) ?? [];
  }

  /** WordPress marks the Customizer or Site Logo block image `custom-logo`. */
  private customLogo(html: string): string | undefined {
    const tag = this.images(html).find((t) => /\bcustom-logo\b/i.test(this.attr(t, 'class') ?? ''));
    return tag ? this.attr(tag, 'src') : undefined;
  }

  /** The first image in the header whose class, alt text or file name says "logo". */
  private headerLogo(html: string): string | undefined {
    const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] ?? '';
    const tag = this.images(header).find((t) =>
      /logo/i.test(
        `${this.attr(t, 'class') ?? ''} ${this.attr(t, 'alt') ?? ''} ${this.attr(t, 'src') ?? ''}`
      )
    );
    return tag ? this.attr(tag, 'src') : undefined;
  }

  private ogImage(html: string): string | undefined {
    const tag = (html.match(/<meta\b[^>]*>/gi) ?? []).find(
      (t) => this.attr(t, 'property') === 'og:image' || this.attr(t, 'name') === 'og:image'
    );
    return tag ? this.attr(tag, 'content') : undefined;
  }

  private resolve(raw: string, pageUrl: string): string | undefined {
    try {
      const url = new URL(raw.replace(/&amp;/g, '&'), pageUrl);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
    } catch {
      return undefined;
    }
  }
}

/** Loads the logo from a file or a live site and returns it as a data URI. */
export class LogoLoader {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly files: FileReader,
    private readonly locator = new LogoLocator()
  ) {}

  async fromFile(path: string): Promise<LoadedLogo> {
    const mime = MIME[extname(path).toLowerCase()];
    if (!mime) {
      throw new Error(`Logo file ${path} must be PNG, JPG, GIF, WebP or SVG.`);
    }
    return { dataUri: this.dataUri(mime, this.files.read(path)), source: 'file', origin: path };
  }

  async fromSite(site: string): Promise<LoadedLogo> {
    const page = new URL(site);
    if (!['http:', 'https:'].includes(page.protocol)) {
      throw new Error(`Site ${site} must be an http or https URL.`);
    }
    const found = this.locator.find(await this.fetcher.text(page.href), page.href);
    if (!found) {
      throw new Error(
        `No logo found on ${site} (no custom logo, header logo or og:image). Pass --logo with a file.`
      );
    }
    const { data, type } = await this.fetcher.bytes(found.url);
    const mime =
      MIME[extname(new URL(found.url).pathname).toLowerCase()] ?? type.split(';')[0].trim();
    if (!mime.startsWith('image/')) {
      throw new Error(`${found.url} is not an image (${type || 'unknown type'}).`);
    }
    return { dataUri: this.dataUri(mime, data), source: found.source, origin: found.url };
  }

  private dataUri(mime: string, data: Buffer): string {
    return `data:${mime};base64,${data.toString('base64')}`;
  }
}
