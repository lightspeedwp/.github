# Block Plugin Tests

Check custom block plugin features:

- block registration works in editor and frontend
- block assets are enqueued only where needed
- editor controls save expected attributes
- dynamic render callbacks handle missing data safely
- block supports match design and editor needs
- variations and transforms work if defined
- deprecated attributes have migration paths
- accessibility labels and semantics are present
- REST/API calls handle errors and permissions correctly
- build assets are generated and committed as required

## Required notes

Flag whether each block is:

- static
- dynamic
- server-rendered
- inner-block based
- pattern-only
- variation of a core block
