import { GoogleGenAI } from '@google/genai';
import { route } from './router.js';
import { getTool } from './tools.js';

// Lazy-init for the same reason as router.js — see comment there.
let ai;
function client() {
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return ai;
}

/**
 * Generates an AI summary for a specific shortened link based on its stats.
 * Single-purpose call, no routing needed — the caller already knows exactly
 * what data is relevant.
 */
export async function generateLinkSummary(linkData) {
  const prompt = `Analyze the following short link data and provide a concise summary, key trends, and recommendations in markdown format:
  Original URL: ${linkData.originalUrl}
  Short Code: ${linkData.shortId}
  Total Clicks: ${linkData.clicks}
  Created At: ${linkData.createdAt}
  `;

  const response = await client().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { temperature: 0.7 },
  });

  return response.text;
}

/**
 * Handles Copilot Chat with a Thought -> Action -> Observation loop instead
 * of dumping the user's entire link list into every prompt:
 *
 *   Thought      route() decides: does this turn need real data at all?
 *   Action       if yes, call exactly the one tool the router picked
 *   Observation  the tool's (small, scoped) return value
 *   Reply        compose the final answer using only that observation
 *
 * Casual turns ("hi", "how do I edit a link") never touch link data or the
 * tool layer at all — they go straight to the reply step. The reply itself
 * runs on gemini-2.5-flash (the doc's split: router on the cheap/frequent
 * model, reply on the stronger one, since it's the only output the user reads).
 */
export async function getCopilotChatResponse(userMessage, chatHistory, userLinks, userName) {
  const decision = await route(userMessage, chatHistory);

  let observation = null;
  if (decision.branch === 'tool' && decision.tool) {
    const tool = getTool(decision.tool);
    if (tool) {
      try {
        observation = await tool.execute({ userLinks, ...decision.args });
      } catch (err) {
        observation = { error: `Tool "${decision.tool}" failed: ${err.message}` };
      }
    }
  }

  const currentTime = new Date().toISOString();
  const systemPrompt = `You are LinkLite Copilot, an AI assistant for the LinkLite URL shortener platform.
You are helping user ${userName}.

${observation !== null
    ? `Data looked up for this question (tool: ${decision.tool}):\n${JSON.stringify(observation, null, 2)}`
    : `No data lookup was needed for this message — answer conversationally, without inventing link data.`}

=== SYSTEM STATUS ===
Current Time: ${currentTime}

Guidelines:
1. Answer using only the data provided above, if any — never invent link stats.
2. If the user asks for an action you cannot perform directly, explain how to do it in the UI.
3. Be professional, clear, and use markdown formatting for lists or tables.
4. Keep your answers concise and focused.`;

  const historyText = chatHistory.map((m) => `${m.role}: ${m.content}`).join('\n');

  const response = await client().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${historyText ? historyText + '\n' : ''}user: ${userMessage}`,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
    },
  });

  return response.text;
}
