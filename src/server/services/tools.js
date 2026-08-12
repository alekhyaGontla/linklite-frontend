/**
 * Tool abstraction for the Copilot agent.
 *
 * Same idea as a Unit-1 `Tool` class: name, description, an argument schema,
 * and an execute() function. The router picks at most one of these per turn
 * instead of the old approach of stuffing the user's entire link list into
 * every prompt regardless of what was asked.
 *
 * `context.userLinks` is passed in by the route handler (today: mock data;
 * swap in a real DB / backend-API call there and every tool below keeps working).
 */

const tools = {
  getUserLinks: {
    name: 'getUserLinks',
    description: "Fetch the user's full list of shortened links with click counts and creation dates.",
    parameters: { type: 'object', properties: {}, required: [] },
    execute: async (context) => context.userLinks,
  },

  getTopLink: {
    name: 'getTopLink',
    description: 'Return the single link with the highest click count.',
    parameters: { type: 'object', properties: {}, required: [] },
    execute: async (context) => {
      if (!context.userLinks?.length) return null;
      return context.userLinks.reduce((best, link) => (link.clicks > best.clicks ? link : best));
    },
  },

  countLinks: {
    name: 'countLinks',
    description: 'Count how many links the user has, optionally filtered by a minimum click count.',
    parameters: {
      type: 'object',
      properties: {
        minClicks: { type: 'number', description: 'Only count links with at least this many clicks.' },
      },
      required: [],
    },
    execute: async (context) => {
      const links = context.userLinks || [];
      const filtered = context.minClicks != null
        ? links.filter((l) => l.clicks >= context.minClicks)
        : links;
      return { count: filtered.length };
    },
  },

  getLinkByShortId: {
    name: 'getLinkByShortId',
    description: 'Look up a single link by its short code (e.g. "promo-2026").',
    parameters: {
      type: 'object',
      properties: {
        shortId: { type: 'string', description: 'The short code to look up.' },
      },
      required: ['shortId'],
    },
    execute: async (context) => (context.userLinks || []).find((l) => l.shortId === context.shortId) || null,
  },
};

export function getTool(name) {
  return tools[name];
}

export const toolNames = Object.keys(tools);

export function toolsDescription() {
  return Object.values(tools)
    .map((t) => {
      const argNames = Object.keys(t.parameters.properties);
      return `- ${t.name}(${argNames.join(', ')}): ${t.description}`;
    })
    .join('\n');
}
