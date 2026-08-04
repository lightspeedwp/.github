/**
 * Custom Heroicons-style SVG icon library
 * 24×24 viewBox, stroke style (not filled)
 * Source: spec icons.jsx
 */

interface IconDef {
  path: string;
  viewBox?: string;
}

const icons: Record<string, IconDef> = {
  // Category icons (8)
  robot: {
    path: `<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 8V5M9 5h6M9 13h.01M15 13h.01M9 16h6"/>`,
  },
  book: {
    path: `<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM19 3v16"/>`,
  },
  chat: {
    path: `<path d="M21 12a8 8 0 0 1-8 8H6l-3 2v-5a8 8 0 1 1 18-5z"/><path d="M8 11h8M8 14h5"/>`,
  },
  sparkles: {
    path: `<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>`,
  },
  shield: {
    path: `<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9.5 12l1.8 1.8L15 10"/>`,
  },
  workflow: {
    path: `<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v3a3 3 0 0 0 3 3h6"/>`,
  },
  puzzle: {
    path: `<path d="M10 4a1.5 1.5 0 0 1 3 0c0 .8.7 1 1.5 1H17v2.5c0 .8.2 1.5 1 1.5a1.5 1.5 0 0 1 0 3c-.8 0-1 .7-1 1.5V17h-2.5c-.8 0-1.5.2-1.5 1a1.5 1.5 0 0 1-3 0c0-.8-.7-1-1.5-1H5v-2.5c0-.8-.2-1.5-1-1.5a1.5 1.5 0 0 1 0-3c.8 0 1-.7 1-1.5V5h2.5C8.3 5 9 4.8 9 4z"/>`,
  },
  wrench: {
    path: `<path d="M15 7a4 4 0 0 0-5 5l-6 6 2 2 6-6a4 4 0 0 0 5-5l-2.5 2.5L12 12l-1-2.5z"/>`,
  },

  // UI icons
  "magnifying-glass": {
    path: `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
  },
  search: {
    path: `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`,
  },
  sun: {
    path: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  },
  moon: {
    path: `<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>`,
  },
  list: {
    path: `<path d="M4 6h16M4 12h16M4 18h16"/>`,
  },
  menu: {
    path: `<path d="M4 6h16M4 12h16M4 18h16"/>`,
  },
  x: {
    path: `<path d="M6 6l12 12M18 6L6 18"/>`,
  },
  close: {
    path: `<path d="M6 6l12 12M18 6L6 18"/>`,
  },
  "chevron-down": {
    path: `<path d="M6 9l6 6 6-6"/>`,
  },
  "caret-down": {
    path: `<path d="M6 9l6 6 6-6"/>`,
  },
  github: {
    path: `<path d="M9 19c-4 1.2-4-2-6-2.5M15 21v-3.5c0-1 .2-1.6-.5-2.2 2.3-.3 4.5-1.2 4.5-5a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-.9-.3-2.9 1a10 10 0 0 0-5 0C7 3.6 6.1 3.9 6.1 3.9a3.6 3.6 0 0 0-.1 2.7A3.9 3.9 0 0 0 5 9.3c0 3.8 2.2 4.7 4.5 5-.5.5-.5 1-.5 1.6V21"/>`,
  },
  external: {
    path: `<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>`,
  },
  bolt: {
    path: `<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>`,
  },
  download: {
    path: `<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>`,
  },
  layers: {
    path: `<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 16.5l9 5 9-5"/>`,
  },

  // Icon aliases for compatibility with existing catalogues and pages
  "book-open": {
    path: `<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM19 3v16"/>`,
  },
  "chat-circle": {
    path: `<path d="M21 12a8 8 0 0 1-8 8H6l-3 2v-5a8 8 0 1 1 18-5z"/><path d="M8 11h8M8 14h5"/>`,
  },
  sparkle: {
    path: `<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>`,
  },
  "git-branch": {
    path: `<path d="M6 3v9a3 3 0 0 0 3 3h6m0 0a3 3 0 0 0 3-3v-9M15 3v3m0 9v3M9 12v3M9 3v3"/>`,
  },
  "puzzle-piece": {
    path: `<path d="M10 4a1.5 1.5 0 0 1 3 0c0 .8.7 1 1.5 1H17v2.5c0 .8.2 1.5 1 1.5a1.5 1.5 0 0 1 0 3c-.8 0-1 .7-1 1.5V17h-2.5c-.8 0-1.5.2-1.5 1a1.5 1.5 0 0 1-3 0c0-.8-.7-1-1.5-1H5v-2.5c0-.8-.2-1.5-1-1.5a1.5 1.5 0 0 1 0-3c.8 0 1-.7 1-1.5V5h2.5C8.3 5 9 4.8 9 4z"/>`,
  },
  "cooking-pot": {
    path: `<path d="M7 4v6a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V4M9 20h6M8 4h8a2 2 0 0 1 2 2v1H6V6a2 2 0 0 1 2-2z"/>`,
  },
  books: {
    path: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5M20 10V7a2 2 0 0 0-2-2h-5.5"/>`,
  },
};

export function getIconSvg(name: string, size: number = 24): string {
  const icon = icons[name];
  if (!icon) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></svg>`;
  }

  const viewBox = icon.viewBox || "0 0 24 24";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon.path}</svg>`;
}
