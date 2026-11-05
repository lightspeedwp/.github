import {
  FetchResponse,
  FontDownloader,
  GoogleFontsClient,
  runGoogleFontsCli,
} from '../google-fonts';

const CSS = `
/* latin-ext */
@font-face {
  font-family: 'Nunito Sans';
  font-style: normal;
  font-weight: 200 1000;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/nunito/ext.woff2) format('woff2');
  unicode-range: U+0100-02BA;
}
/* latin */
@font-face {
  font-family: 'Nunito Sans';
  font-style: normal;
  font-weight: 200 1000;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/nunito/latin.woff2) format('woff2');
  unicode-range: U+0000-00FF;
}
/* latin */
@font-face {
  font-family: 'Nunito Sans';
  font-style: italic;
  font-weight: 200 1000;
  src: url(https://fonts.gstatic.com/s/nunito/latin-italic.woff2) format('woff2');
}
@font-face {
  font-family: 'Nunito Sans';
  src: url(https://fonts.gstatic.com/s/nunito/old.ttf) format('truetype');
}
`;

function response(body: string, status = 200): FetchResponse {
  return {
    ok: status < 400,
    status,
    text: async () => body,
    arrayBuffer: async () => new TextEncoder().encode(body).buffer as ArrayBuffer,
  };
}

function fakeFetch(routes: Record<string, FetchResponse>) {
  const calls: Array<{ url: string; headers?: Record<string, string> }> = [];
  const fetcher = async (url: string, init?: { headers?: Record<string, string> }) => {
    calls.push({ url, headers: init?.headers });
    const key = Object.keys(routes).find((route) => url.startsWith(route));
    return key ? routes[key] : response('not found', 404);
  };
  return { fetcher, calls };
}

function fakeWriter() {
  const dirs: string[] = [];
  const files: Record<string, number> = {};
  return {
    dirs,
    files,
    writer: {
      mkdir: (path: string) => dirs.push(path),
      writeFile: (path: string, data: Uint8Array) => {
        files[path] = data.byteLength;
      },
    },
  };
}

describe('GoogleFontsClient', () => {
  const client = new GoogleFontsClient(fakeFetch({}).fetcher);

  it('builds variable and static CSS2 URLs', () => {
    expect(
      client.buildCssUrl({ family: 'Nunito Sans', weights: '200..1000', styles: ['normal'] })
    ).toBe('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200..1000&display=swap');
    expect(
      client.buildCssUrl({
        family: 'Lora',
        weights: '700, 400,400',
        styles: ['italic', 'normal'],
      })
    ).toBe(
      'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap'
    );
  });

  it('rejects invalid weights', () => {
    expect(() =>
      client.buildCssUrl({ family: 'Lora', weights: 'bold', styles: ['normal'] })
    ).toThrow('Invalid weights');
    expect(() =>
      client.buildCssUrl({ family: 'Lora', weights: ' , ', styles: ['normal'] })
    ).toThrow('Invalid weights');
  });

  it('parses WOFF2 faces with their subsets and skips other formats', () => {
    const faces = GoogleFontsClient.parseCss(CSS);

    expect(faces).toHaveLength(3);
    expect(faces[0]).toEqual({
      subset: 'latin-ext',
      fontFamily: 'Nunito Sans',
      fontStyle: 'normal',
      fontWeight: '200 1000',
      url: 'https://fonts.gstatic.com/s/nunito/ext.woff2',
      unicodeRange: 'U+0100-02BA',
    });
    expect(faces[2]).toMatchObject({ subset: 'latin', fontStyle: 'italic' });
  });

  it('fills defaults for sparse blocks', () => {
    expect(
      GoogleFontsClient.parseCss('@font-face { src: url("a.woff2") format("woff2"); }')
    ).toEqual([
      {
        subset: 'default',
        fontFamily: '',
        fontStyle: 'normal',
        fontWeight: '400',
        url: 'a.woff2',
        unicodeRange: undefined,
      },
    ]);
  });

  it('sends a browser user agent and explains a failed range request', async () => {
    const { fetcher, calls } = fakeFetch({
      'https://fonts.googleapis.com': response('bad', 400),
    });
    const failing = new GoogleFontsClient(fetcher);

    await expect(
      failing.fetchFaces({ family: 'Lora', weights: '100..900', styles: ['normal'] })
    ).rejects.toThrow('may not be variable');
    await expect(
      failing.fetchFaces({ family: 'Lora', weights: '400', styles: ['normal'] })
    ).rejects.toThrow('returned 400 for Lora.');
    expect(calls[0].headers?.['User-Agent']).toContain('Chrome');
  });
});

describe('FontDownloader', () => {
  const faces = GoogleFontsClient.parseCss(CSS);

  it('saves one subset with simple file names', async () => {
    const { fetcher } = fakeFetch({ 'https://fonts.gstatic.com': response('woff2') });
    const { writer, dirs, files } = fakeWriter();

    const entries = await new FontDownloader(fetcher, writer).download(faces, './assets/fonts/', [
      'latin',
    ]);

    expect(dirs).toEqual(['assets/fonts/nunito-sans']);
    expect(Object.keys(files)).toEqual([
      'assets/fonts/nunito-sans/nunito-sans-200-1000-normal.woff2',
      'assets/fonts/nunito-sans/nunito-sans-200-1000-italic.woff2',
    ]);
    expect(entries[0]).toEqual({
      fontFamily: 'Nunito Sans',
      fontStyle: 'normal',
      fontWeight: '200 1000',
      src: ['file:./assets/fonts/nunito-sans/nunito-sans-200-1000-normal.woff2'],
    });
  });

  it('adds subset suffixes and unicode ranges for several subsets', async () => {
    const { fetcher } = fakeFetch({ 'https://fonts.gstatic.com': response('woff2') });
    const { writer } = fakeWriter();

    const entries = await new FontDownloader(fetcher, writer).download(faces, 'fonts', [
      'latin',
      'latin-ext',
    ]);

    expect(entries[0].src[0]).toBe(
      'file:./fonts/nunito-sans/nunito-sans-200-1000-normal-latin-ext.woff2'
    );
    expect(entries[0].unicodeRange).toBe('U+0100-02BA');
    expect(entries[2].unicodeRange).toBeUndefined();
  });

  it('writes src paths relative to an absolute theme root', async () => {
    const { fetcher } = fakeFetch({ 'https://fonts.gstatic.com': response('woff2') });
    const { writer, files } = fakeWriter();

    const entries = await new FontDownloader(fetcher, writer).download(
      faces,
      '/sites/tsp/wp-content/themes/tsp-theme/assets/fonts',
      ['latin'],
      '/sites/tsp/wp-content/themes/tsp-theme'
    );

    expect(Object.keys(files)[0]).toBe(
      '/sites/tsp/wp-content/themes/tsp-theme/assets/fonts/nunito-sans/nunito-sans-200-1000-normal.woff2'
    );
    expect(entries[0].src).toEqual([
      'file:./assets/fonts/nunito-sans/nunito-sans-200-1000-normal.woff2',
    ]);
  });

  it('refuses an output folder outside the theme root', async () => {
    const { writer, dirs } = fakeWriter();

    await expect(
      new FontDownloader(fakeFetch({}).fetcher, writer).download(
        faces,
        '/tmp/fonts',
        ['latin'],
        '/sites/tsp/theme'
      )
    ).rejects.toThrow('must be inside the theme root');
    expect(dirs).toEqual([]);
  });

  it('fails on a missing subset or a failed download', async () => {
    const { writer } = fakeWriter();

    await expect(
      new FontDownloader(fakeFetch({}).fetcher, writer).download(faces, 'fonts', ['greek'])
    ).rejects.toThrow('Available: latin-ext, latin');
    await expect(
      new FontDownloader(fakeFetch({}).fetcher, writer).download([], 'fonts', ['latin'])
    ).rejects.toThrow('Available: none');
    await expect(
      new FontDownloader(fakeFetch({}).fetcher, writer).download(faces, 'fonts', ['latin'])
    ).rejects.toThrow('Download failed (404)');
  });
});

describe('runGoogleFontsCli', () => {
  function deps(routes: Record<string, FetchResponse>) {
    const out: string[] = [];
    const err: string[] = [];
    const { writer, files } = fakeWriter();
    return {
      out,
      err,
      files,
      deps: {
        fetcher: fakeFetch(routes).fetcher,
        writer,
        stdout: (text: string) => out.push(text),
        stderr: (text: string) => err.push(text),
      },
    };
  }

  const routes = {
    'https://fonts.googleapis.com': response(CSS),
    'https://fonts.gstatic.com': response('woff2'),
  };

  it('prints a fontFamilies entry', async () => {
    const run = deps(routes);

    const code = await runGoogleFontsCli(
      [
        '--family',
        'Nunito Sans',
        '--slug',
        'body',
        '--weights',
        '200..1000',
        '--styles',
        'normal,italic',
        '--fallback',
        'serif',
        '--out',
        'theme/assets/fonts',
        '--theme-root',
        'theme',
      ],
      run.deps
    );

    expect(code).toBe(0);
    const entry = JSON.parse(run.out.join(''));
    expect(entry).toMatchObject({
      name: 'Nunito Sans',
      slug: 'body',
      fontFamily: '"Nunito Sans", serif',
    });
    expect(entry.fontFace).toHaveLength(2);
    expect(entry.fontFace[0].src[0]).toBe(
      'file:./assets/fonts/nunito-sans/nunito-sans-200-1000-normal.woff2'
    );
    expect(Object.keys(run.files)).toHaveLength(2);
  });

  it('leaves single-word families unquoted', async () => {
    const run = deps(routes);

    await runGoogleFontsCli(['--family', 'Lora', '--slug', 'heading'], run.deps);

    expect(JSON.parse(run.out.join('')).fontFamily).toBe('Lora, sans-serif');
  });

  it('prints help', async () => {
    const run = deps(routes);

    expect(await runGoogleFontsCli(['--help'], run.deps)).toBe(0);
    expect(run.out.join('')).toContain('Usage: google-fonts');
  });

  it.each([
    [['--colour', 'red'], 'Unknown argument --colour'],
    [['Lora'], 'Unknown argument Lora'],
    [['--family'], '--family needs a value'],
    [['--family', 'Lora'], '--family and --slug are required'],
    [['--family', 'Lora', '--slug', 'body', '--styles', 'oblique'], '--styles accepts'],
  ])('fails cleanly for %j', async (argv, message) => {
    const run = deps(routes);

    expect(await runGoogleFontsCli(argv as string[], run.deps)).toBe(1);
    expect(run.err.join('')).toContain(message);
  });
});
