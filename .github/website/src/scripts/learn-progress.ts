export const STORAGE_KEY = "ag-learn";
export const LEGACY_KEYS = ["ag-learn-read", "ag_learn_progress"];

export const READ_TICK = `
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" fill="rgba(0, 208, 132, 0.16)" stroke="currentColor" stroke-width="1.5"></circle>
    <path d="M4.8 8.1l2 2 4.4-4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`;

export const UNREAD_TICK = `
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" opacity=".35"></circle>
  </svg>
`;

export function loadReadIds(): Set<string> {
  try {
    const sources = [
      localStorage.getItem(STORAGE_KEY),
      ...LEGACY_KEYS.map((key) => localStorage.getItem(key)),
    ];
    const ids = new Set<string>();

    for (const raw of sources) {
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => {
          if (typeof id === "string") ids.add(id);
        });
        continue;
      }

      if (parsed && typeof parsed === "object") {
        for (const [trackId, lessons] of Object.entries(parsed)) {
          if (!lessons || typeof lessons !== "object") continue;
          for (const [lessonSlug, read] of Object.entries(lessons)) {
            if (read) ids.add(`${trackId}/${lessonSlug}`);
          }
        }
      }
    }

    return ids;
  } catch {
    return new Set();
  }
}

export function persistReadIds(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage unavailable
  }
}
