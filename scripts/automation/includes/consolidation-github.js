/**
 * GitHub access for the label consolidation (spec 008, FR-016, FR-023).
 *
 * Reads page through every result, so no label is missed (`label-sync.js`
 * reads only the first 100). Every write goes through the shared write queue
 * (`label-write-queue.js`), so writes run one at a time, a second apart, and
 * pause on a rate limit. The request function is injected, so tests need no
 * network.
 */

import { githubApiRequest } from './github-api-optimized.js';
import { createWriteQueue, githubWrite } from './label-write-queue.js';

const PER_PAGE = 100;
const MAX_PAGES = 1000;

/**
 * Creates a client for one token.
 * @param {object} options
 * @param {string} options.token - GitHub token; never logged
 * @param {ReturnType<typeof createWriteQueue>} [options.queue] - Shared write queue
 * @param {Function} [options.request] - Replaces `githubApiRequest`, for tests
 * @returns {object} The client
 */
export function createConsolidationClient({
  token,
  queue = createWriteQueue(),
  request = githubApiRequest,
}) {
  const requestOptions = { token, useCache: false };
  const discussionCache = new Map();

  const read = (path) => request('GET', path, null, requestOptions);
  const write = (method, path, body) => githubWrite(queue, method, path, body, { token }, request);
  const enc = encodeURIComponent;

  /**
   * Reads every page of a list endpoint.
   * @param {string} path - Path without paging parameters
   * @returns {Promise<{ items: object[], pages: number }>} All items and the pages read
   */
  async function readAll(path) {
    const items = [];
    let pages = 0;
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const url = `${path}${path.includes('?') ? '&' : '?'}per_page=${PER_PAGE}&page=${page}`;
      const data = await read(url);
      if (!Array.isArray(data)) {
        throw new Error(`Expected a list from ${path}`);
      }
      pages += 1;
      items.push(...data);
      if (data.length < PER_PAGE) {
        return { items, pages };
      }
    }
    throw new Error(
      `${path} returned more than ${MAX_PAGES} pages; refusing to continue with a partial read`
    );
  }

  /** Runs a GraphQL query or mutation. */
  async function graphql(method, query, variables) {
    const body = { query, variables };
    const response =
      method === 'read'
        ? await request('POST', '/graphql', body, requestOptions)
        : await write('POST', '/graphql', body);
    if (response?.errors?.length) {
      throw new Error(`GraphQL error: ${response.errors.map((e) => e.message).join('; ')}`);
    }
    return response?.data;
  }

  return {
    queue,

    /**
     * Reads the login the token belongs to.
     * @returns {Promise<string>} Login
     */
    async getViewerLogin() {
      const user = await read('/user');
      return user.login;
    },

    /**
     * Lists the organisation's repositories.
     * @param {string} org - Organisation login
     * @returns {Promise<object[]>} Repository objects
     */
    async listRepos(org) {
      return (await readAll(`/orgs/${enc(org)}/repos?type=all`)).items;
    },

    /**
     * Reads every label of a repository.
     * @param {string} fullName - `owner/name`
     * @returns {Promise<{ labels: object[], pages: number }>} Labels and pages read
     */
    async listLabels(fullName) {
      const { items, pages } = await readAll(`/repos/${fullName}/labels`);
      return { labels: items, pages };
    },

    /**
     * Lists issues and pull requests, open and closed, carrying a label.
     * @param {string} fullName - `owner/name`
     * @param {string} label - Exact label name
     * @returns {Promise<Array<{ kind: string, number: number, state: string, labels: string[] }>>} Items
     */
    async listItemsByLabel(fullName, label) {
      const { items } = await readAll(`/repos/${fullName}/issues?state=all&labels=${enc(label)}`);
      return items.map((item) => ({
        kind: item.pull_request ? 'pull_request' : 'issue',
        number: item.number,
        state: item.state,
        labels: (item.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name)),
      }));
    },

    /**
     * Lists Discussions carrying a label. Discussions have no label filter in
     * GraphQL, so they are read once per repository and filtered here.
     * @param {string} fullName - `owner/name`
     * @param {string} label - Exact label name
     * @returns {Promise<Array<{ kind: string, number: number, state: string, labels: string[] }>>} Discussions
     */
    async listDiscussionsByLabel(fullName, label) {
      if (!discussionCache.has(fullName)) {
        discussionCache.set(fullName, readDiscussions(fullName));
      }
      const all = await discussionCache.get(fullName);
      return all.filter((d) => d.labels.includes(label));
    },

    /** Forgets cached Discussions, for a re-read just before deleting. */
    forgetDiscussions(fullName) {
      discussionCache.delete(fullName);
    },

    /**
     * Reads one issue or pull request.
     * @param {string} fullName - `owner/name`
     * @param {number} number - Issue number
     * @returns {Promise<object | null>} The issue, or null when it does not exist
     */
    async getIssue(fullName, number) {
      try {
        return await read(`/repos/${fullName}/issues/${number}`);
      } catch (error) {
        if (/\b404\b/.test(error.message)) {
          return null;
        }
        throw error;
      }
    },

    /**
     * Reads a gate comment from its URL (`.../issues/N#issuecomment-ID`).
     * @param {string} url - Comment URL
     * @returns {Promise<object | null>} The comment, or null when it cannot be read
     */
    async getCommentByUrl(url) {
      const match = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/issues\/\d+#issuecomment-(\d+)$/.exec(
        url
      );
      if (!match) {
        return null;
      }
      try {
        return await read(`/repos/${match[1]}/issues/comments/${match[2]}`);
      } catch (error) {
        if (/\b404\b/.test(error.message)) {
          return null;
        }
        throw error;
      }
    },

    /**
     * Lists the comments on an issue.
     * @param {string} fullName - `owner/name`
     * @param {number} number - Issue number
     * @returns {Promise<object[]>} Comments
     */
    async listIssueComments(fullName, number) {
      return (await readAll(`/repos/${fullName}/issues/${number}/comments`)).items;
    },

    createLabel: (fullName, label) => write('POST', `/repos/${fullName}/labels`, label),

    updateLabel: (fullName, currentName, patch) =>
      write('PATCH', `/repos/${fullName}/labels/${enc(currentName)}`, patch),

    deleteLabel: (fullName, name) =>
      write('DELETE', `/repos/${fullName}/labels/${enc(name)}`, null),

    addLabelToItem: (fullName, number, label) =>
      write('POST', `/repos/${fullName}/issues/${number}/labels`, { labels: [label] }),

    removeLabelFromItem: (fullName, number, label) =>
      write('DELETE', `/repos/${fullName}/issues/${number}/labels/${enc(label)}`, null),

    /** Posts a comment on an issue. */
    postComment: (fullName, number, body) =>
      write('POST', `/repos/${fullName}/issues/${number}/comments`, { body }),

    /**
     * Adds or removes a label on a Discussion.
     * @param {string} fullName - `owner/name`
     * @param {number} number - Discussion number
     * @param {string} label - Exact label name
     * @param {'add' | 'remove'} mode - What to do
     */
    async setDiscussionLabel(fullName, number, label, mode) {
      const [owner, name] = fullName.split('/');
      const ids = await graphql(
        'read',
        `
          query ($owner: String!, $name: String!, $number: Int!, $label: String!) {
            repository(owner: $owner, name: $name) {
              label(name: $label) {
                id
              }
              discussion(number: $number) {
                id
              }
            }
          }
        `,
        { owner, name, number, label }
      );
      const labelId = ids?.repository?.label?.id;
      const discussionId = ids?.repository?.discussion?.id;
      if (!labelId || !discussionId) {
        throw new Error(`Cannot find ${label} or discussion #${number} in ${fullName}`);
      }
      const mutation =
        mode === 'add'
          ? 'mutation($id:ID!,$labels:[ID!]!){addLabelsToLabelable(input:{labelableId:$id,labelIds:$labels}){clientMutationId}}'
          : 'mutation($id:ID!,$labels:[ID!]!){removeLabelsFromLabelable(input:{labelableId:$id,labelIds:$labels}){clientMutationId}}';
      await graphql('write', mutation, { id: discussionId, labels: [labelId] });
    },
  };

  /** Reads every Discussion with its labels. */
  async function readDiscussions(fullName) {
    const [owner, name] = fullName.split('/');
    const query = `query($owner:String!,$name:String!,$after:String){
      repository(owner:$owner,name:$name){
        hasDiscussionsEnabled
        discussions(first:100,after:$after){
          pageInfo{hasNextPage endCursor}
          nodes{number closed labels(first:100){nodes{name}}}
        }
      }
    }`;
    const found = [];
    let after = null;
    for (let page = 0; page < MAX_PAGES; page += 1) {
      const data = await graphql('read', query, { owner, name, after });
      const repository = data?.repository;
      if (!repository?.hasDiscussionsEnabled) {
        return [];
      }
      for (const node of repository.discussions.nodes) {
        found.push({
          kind: 'discussion',
          number: node.number,
          state: node.closed ? 'closed' : 'open',
          labels: (node.labels?.nodes ?? []).map((l) => l.name),
        });
      }
      if (!repository.discussions.pageInfo.hasNextPage) {
        return found;
      }
      after = repository.discussions.pageInfo.endCursor;
    }
    throw new Error(
      `Discussions in ${fullName} exceeded ${MAX_PAGES} pages; refusing a partial read`
    );
  }
}

export default { createConsolidationClient };
