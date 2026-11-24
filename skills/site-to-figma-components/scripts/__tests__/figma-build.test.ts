import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

// Exercise the documented read-only scan against synthetic Figma nodes.
const guide = readFileSync(
  join(process.cwd(), 'skills/site-to-figma-components/references/figma-build.md'),
  'utf8'
);
const snippet = /```js\n([\s\S]*?)\n```/.exec(guide)![1];

describe('documented composition scan', () => {
  it('continues after an unresolved instance and records every changed text property', async () => {
    const owner = {
      type: 'COMPONENT_SET',
      description: 'Inventory id pattern:cards',
      componentPropertyDefinitions: {
        'Heading#1': { defaultValue: 'Heading' },
        'Body#2': { defaultValue: 'Body' },
        'Link#3': { defaultValue: 'Link' },
      },
    };
    const main = { parent: owner };
    const instance = {
      type: 'INSTANCE',
      getMainComponentAsync: async () => main,
      componentProperties: {
        'Heading#1': { type: 'TEXT', value: 'Heading' },
        'Body#2': { type: 'TEXT', value: 'New body' },
        'Link#3': { type: 'TEXT', value: '' },
        Visible: { type: 'BOOLEAN', value: false },
      },
    };
    const children = [
      { type: 'INSTANCE', id: '1:2', getMainComponentAsync: async () => null },
      instance,
      {
        ...instance,
        getMainComponentAsync: async () => ({ ...owner, parent: null }),
        componentProperties: {},
      },
      { type: 'FRAME', name: 'Custom' },
    ];
    const out = await runInNewContext(`(async () => { ${snippet} })()`, {
      figma: { getNodeByIdAsync: async () => ({ children }) },
    });
    expect(out).toEqual([
      { id: 'unknown:1:2' },
      { id: 'pattern:cards', overrides: { 'Body#2': 'New body', 'Link#3': '' } },
      'pattern:cards',
      { id: 'local:Custom' },
    ]);
  });
});
