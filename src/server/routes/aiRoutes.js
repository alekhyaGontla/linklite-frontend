import express from 'express';
import { generateLinkSummary, getCopilotChatResponse } from '../services/aiService.js';
// Import your database models/queries here (e.g., to fetch user links)

const router = express.Router();

// POST /api/ai/summarize-link
router.post('/summarize-link', async (req, res) => {
  try {
    const { shortId } = req.body;
    // TODO: Fetch link data from database using shortId and req.user.id
    const mockLinkData = { shortId, originalUrl: "https://example.com/long", clicks: 1245, createdAt: "2026-01-15" };
    
    const summary = await generateLinkSummary(mockLinkData);
    res.json({ summary });
  } catch (error) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ error: "Failed to generate AI summary." });
  }
});

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const userName = req.user?.name || "User"; // Assuming auth middleware attaches user

    // TODO: Fetch user's links from database
    const mockUserLinks = [
      { shortId: "promo-2026", originalUrl: "https://example.com/promo", clicks: 432 }
    ];

    const reply = await getCopilotChatResponse(message, chatHistory || [], mockUserLinks, userName);
    res.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
});

export default router;