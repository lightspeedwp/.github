const DIACRITICS_RE = /[\u0300-\u036f]/g;
const NON_ALNUM_RE = /[^a-z0-9]+/g;

export function normaliseSearchText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase()
    .replace(NON_ALNUM_RE, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function getSearchTokens(query) {
  const normalised = normaliseSearchText(query);
  return normalised ? normalised.split(" ") : [];
}

export function matchesSearchQuery(fields, query) {
  const tokens = getSearchTokens(query);
  if (tokens.length === 0) return true;

  const haystack = normaliseSearchText(fields.join(" "));
  return tokens.every((token) => haystack.includes(token));
}

function scoreField(field, token, weight) {
  if (!field || !field.includes(token)) return 0;

  let score = weight;
  if (field === token) score += weight * 0.75;
  if (field.startsWith(token)) score += weight * 0.5;
  if ((" " + field + " ").includes(" " + token + " ")) score += weight * 0.25;

  return score;
}

export function scoreSearchItem(item, query) {
  const tokens = getSearchTokens(query);
  if (tokens.length === 0) return 0;

  const fields = {
    name: normaliseSearchText(item.name),
    description: normaliseSearchText(item.description ?? item.desc),
    category: normaliseSearchText(item.cat || item.catLabel || ""),
    tags: normaliseSearchText((item.tags || []).join(" ")),
  };

  return tokens.reduce((total, token) => {
    const nameScore = scoreField(fields.name, token, 100);
    const categoryScore = scoreField(fields.category, token, 65);
    const tagScore = scoreField(fields.tags, token, 60);
    const descriptionScore = scoreField(fields.description, token, 25);
    return total + nameScore + categoryScore + tagScore + descriptionScore;
  }, 0);
}

export function rankSearchItems(items, query) {
  const tokens = getSearchTokens(query);
  if (tokens.length === 0) return items.slice();

  return items
    .map((item, index) => ({
      item,
      index,
      score: scoreSearchItem(item, query),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}
