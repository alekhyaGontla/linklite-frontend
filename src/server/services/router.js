import { GoogleGenAI, Type } from '@google/genai';
import { toolNames, toolsDescription } from './tools.js';

// Lazy-init for the same reason as aiService.js — module imports resolve
// before index.js's own dotenv.config() call runs in ESM, so building the
// client at import time would read an empty process.env.
let ai;
function client() {
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return ai;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    branch: { type: Type.STRING, enum: ['chat', 'tool'] },
    tool: { type: Type.STRING, nullable: true },
    args: { type: Type.OBJECT, nullable: true },
  },
  required: ['branch'],
};

/**
 * Router — the "Thought" step of the agent loop.
 *
 * Decides, cheaply and before touching any link data, whether this turn
 * needs a tool call at all. This is the same judgment call your hotel-agent
 * doc describes for recommendations: don't fire on every turn (too eager —
 * dumping the user's whole link list into a "hi" reply), and don't stay
 * silent when the question clearly needs data (too passive — "which of my
 * links gets the most clicks" answered with generic chat).
 *
 * Runs on gemini-2.5-flash-lite, same reasoning as the doc's "router doesn't
 * need a reasoning model" call — this is classification, not generation —
 * and Flash-Lite is the free-tier model built for exactly that.
 */
export async function route(userMessage, chatHistory = []) {
  const systemPrompt = `You are the router for LinkLite Copilot, a URL-shortener assistant.

Decide whether the user's latest message needs a lookup against their real
link data, or whether it's general conversation / a how-to question that
needs no data.

Available tools:
${toolsDescription()}

Rules:
- Only choose "tool" when the message clearly needs live data (click counts,
  "which link", "how many", a specific short code, etc.).
- Greetings, UI how-to questions, and general chat are branch "chat" — do not
  invent a tool call for these.
- If branch is "tool", pick exactly one tool from: ${toolNames.join(', ')}.
- Extract any arguments the chosen tool needs directly from the message.`;

  const historyText = chatHistory
    .slice(-4)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const response = await client().models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: `${historyText ? historyText + '\n' : ''}user: ${userMessage}`,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema,
    },
  });

  try {
    const parsed = JSON.parse(response.text);
    if (parsed.branch !== 'tool' || !toolNames.includes(parsed.tool)) {
      return { branch: 'chat', tool: null, args: {} };
    }
    return { branch: 'tool', tool: parsed.tool, args: parsed.args || {} };
  } catch {
    // Malformed JSON from the model — fail safe into plain chat rather than
    // crash the turn.
    return { branch: 'chat', tool: null, args: {} };
  }
}
