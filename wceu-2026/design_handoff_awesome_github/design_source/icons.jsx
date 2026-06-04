/* Heroicons (outline, 24×24, 1.5 stroke) — the LightSpeed icon set. */
const S = ({ children, size = 20, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
       strokeLinejoin="round" style={{ flex: "none", ...style }}>{children}</svg>
);

const Icons = {
  robot: (p) => <S {...p}><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 8V5M9 5h6M9 13h.01M15 13h.01M9 16h6"/></S>,
  book: (p) => <S {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM19 3v16"/></S>,
  sparkles: (p) => <S {...p}><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/></S>,
  shield: (p) => <S {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9.5 12l1.8 1.8L15 10"/></S>,
  puzzle: (p) => <S {...p}><path d="M10 4a1.5 1.5 0 0 1 3 0c0 .8.7 1 1.5 1H17v2.5c0 .8.2 1.5 1 1.5a1.5 1.5 0 0 1 0 3c-.8 0-1 .7-1 1.5V17h-2.5c-.8 0-1.5.2-1.5 1a1.5 1.5 0 0 1-3 0c0-.8-.7-1-1.5-1H5v-2.5c0-.8-.2-1.5-1-1.5a1.5 1.5 0 0 1 0-3c.8 0 1-.7 1-1.5V5h2.5C8.3 5 9 4.8 9 4z"/></S>,
  workflow: (p) => <S {...p}><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v3a3 3 0 0 0 3 3h6"/></S>,
  wrench: (p) => <S {...p}><path d="M15 7a4 4 0 0 0-5 5l-6 6 2 2 6-6a4 4 0 0 0 5-5l-2.5 2.5L12 12l-1-2.5z"/></S>,
  grad: (p) => <S {...p}><path d="M3 9l9-4 9 4-9 4z"/><path d="M7 11v4c0 1 2.5 2.5 5 2.5s5-1.5 5-2.5v-4M21 9v5"/></S>,
  search: (p) => <S {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></S>,
  copy: (p) => <S {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></S>,
  check: (p) => <S {...p}><path d="M5 12.5l4.5 4.5L19 7"/></S>,
  download: (p) => <S {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></S>,
  external: (p) => <S {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></S>,
  arrow: (p) => <S {...p}><path d="M5 12h14M13 6l6 6-6 6"/></S>,
  arrowLeft: (p) => <S {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></S>,
  sun: (p) => <S {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></S>,
  moon: (p) => <S {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></S>,
  vscode: (p) => <S {...p}><path d="M16 3v18l5-3V6zM16 8.5L8 16l-3-2 11-9zM16 15.5L8 8 5 10l11 9z"/></S>,
  github: (p) => <S {...p}><path d="M9 19c-4 1.2-4-2-6-2.5M15 21v-3.5c0-1 .2-1.6-.5-2.2 2.3-.3 4.5-1.2 4.5-5a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-.9-.3-2.9 1a10 10 0 0 0-5 0C7 3.6 6.1 3.9 6.1 3.9a3.6 3.6 0 0 0-.1 2.7A3.9 3.9 0 0 0 5 9.3c0 3.8 2.2 4.7 4.5 5-.5.5-.5 1-.5 1.6V21"/></S>,
  menu: (p) => <S {...p}><path d="M4 6h16M4 12h16M4 18h16"/></S>,
  chevron: (p) => <S {...p}><path d="M6 9l6 6 6-6"/></S>,
  close: (p) => <S {...p}><path d="M6 6l12 12M18 6L6 18"/></S>,
  layers: (p) => <S {...p}><path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 16.5l9 5 9-5"/></S>,
  bolt: (p) => <S {...p}><path d="M13 3L5 13h6l-1 8 8-10h-6z"/></S>,
  chat: (p) => <S {...p}><path d="M21 12a8 8 0 0 1-8 8H6l-3 2v-5a8 8 0 1 1 18-5z"/><path d="M8 11h8M8 14h5"/></S>,
  clock: (p) => <S {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></S>,
  play: (p) => <S {...p}><path d="M7 5l12 7-12 7z"/></S>,
  doc: (p) => <S {...p}><path d="M7 3h7l5 5v13H7zM14 3v5h5"/><path d="M10 13h6M10 17h6"/></S>,
  recipe: (p) => <S {...p}><path d="M8 3v6a4 4 0 0 0 8 0V3"/><path d="M12 13v8M8 21h8"/></S>,
  terminal: (p) => <S {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/></S>,
  schema: (p) => <S {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a2 2 0 0 1 2 2V14"/></S>,
  list: (p) => <S {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></S>,
  check2: (p) => <S {...p}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></S>,
};

window.Icons = Icons;
