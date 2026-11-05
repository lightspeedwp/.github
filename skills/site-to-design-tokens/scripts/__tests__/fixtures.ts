import type { ElementSample, PageCapture, SiteStyles } from '../crawl-site-styles';

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

/** Samples shaped like the live TSP site, at one viewport. */
function samples(desktop: boolean): ElementSample[] {
  const list: ElementSample[] = [];
  const add = (count: number, sample: Omit<ElementSample, 'key'>, prefix: string) => {
    for (let i = 0; i < count; i++) {
      list.push({ key: `${prefix}:${i}`, ...sample });
    }
  };
  const heading = (role: ElementSample['role'], max: number, min: number) =>
    add(
      3,
      {
        role,
        color: rgb('#262423'),
        fontFamily: 'Moret',
        fontSize: desktop ? max : min,
        fontWeight: 400,
        lineHeight: (desktop ? max : min) * 1.2,
      },
      role
    );

  add(
    40,
    {
      role: 'body',
      color: rgb('#262423'),
      fontFamily: 'Lora',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 24,
    },
    'p'
  );
  add(
    12,
    {
      role: 'body',
      color: rgb('#68645f'),
      fontFamily: 'Lora',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 18,
    },
    'small'
  );
  add(
    6,
    {
      role: 'body',
      color: rgb('#68645f'),
      fontFamily: 'Lora',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 20,
    },
    'caption'
  );
  add(
    25,
    {
      role: 'link',
      color: rgb('#8d621f'),
      fontFamily: 'Lora',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 24,
    },
    'a'
  );
  add(
    8,
    {
      role: 'button',
      color: rgb('#ffffff'),
      background: rgb('#565b3d'),
      fontFamily: 'Lora',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 24,
      paddingBlock: 16,
      paddingInline: 24,
      radius: '8px',
      shadow: 'rgba(9, 9, 9, 0.2) 0px 2px 4px 0px, rgba(9, 9, 9, 0.1) 0px 0px 1px 0px',
    },
    'button'
  );
  add(
    4,
    {
      role: 'button',
      color: rgb('#ffffff'),
      background: rgb('#a31700'),
      fontFamily: 'Lora',
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 24,
      radius: '8px',
    },
    'cta'
  );
  add(
    5,
    {
      role: 'input',
      color: rgb('#262423'),
      border: rgb('#8a8580'),
      fontFamily: 'Lora',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 24,
      radius: '4px',
      shadow: 'rgba(9, 9, 9, 0.1) 0px 1px 1px 0px',
    },
    'input'
  );
  add(
    2,
    {
      role: 'surface',
      background: rgb('#ffffff'),
      radius: '50%',
      shadow: 'rgba(9, 9, 9, 0.25) 0px 8px 16px 0px inset',
    },
    'avatar'
  );
  heading('h1', 60, 36);
  heading('h2', 48, 32);
  heading('h3', 40, 24);
  heading('h4', 32, 22);
  heading('h5', 24, 20);
  heading('h6', 20, 16);
  add(
    6,
    { role: 'section', background: rgb('#ffffff'), paddingBlock: desktop ? 100 : 72 },
    'section-white'
  );
  add(
    4,
    { role: 'section', background: rgb('#f6f3f1'), paddingBlock: desktop ? 80 : 60 },
    'section-sand'
  );
  add(
    2,
    { role: 'section', background: rgb('#262423'), paddingBlock: desktop ? 60 : 48 },
    'section-dark'
  );
  add(
    3,
    { role: 'surface', background: rgb('#ffffff'), paddingBlock: desktop ? 40 : 32, gap: 20 },
    'card'
  );
  add(3, { role: 'surface', containerWidth: desktop ? 1240 : 358 }, 'wide');
  add(3, { role: 'surface', containerWidth: desktop ? 768 : 358 }, 'content');
  return list;
}

export function tspLikeStyles(): SiteStyles {
  const capture = (viewport: number): PageCapture => ({
    url: 'https://www.example.com/',
    viewport,
    samples: samples(viewport === 1440),
    mediaWidths: [768, 768, 1240, 376, 1240, 1240],
  });
  return {
    site: 'https://www.example.com',
    capturedAt: '2026-11-03T00:00:00.000Z',
    viewports: [390, 1440],
    captures: [capture(390), capture(1440)],
  };
}
