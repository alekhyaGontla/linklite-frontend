import dotenv from 'dotenv';
dotenv.config();
// Change this line:
// import { generateLinkSummary, getCopilotChatResponse } from './services/aiService.js';

// To this:
import { generateLinkSummary, getCopilotChatResponse } from '../services/aiService.js';

async function runTests() {
  console.log("🚀 Starting AI Service Integration Tests...\n");

  try {
    // Test 1: Link Summarizer
    console.log("Testing Link Summarizer (Feature A)...");
    const mockLinkData = {
      shortId: "test-xyz",
      originalUrl: "https://github.com/features/actions",
      clicks: 342,
      createdAt: "2026-06-01"
    };

    const summaryResult = await generateLinkSummary(mockLinkData);
    console.log("✅ Summary Result Received:\n");
    console.log(summaryResult);
    console.log("\n--------------------------------------------------\n");

    // Test 2: Copilot Chat
    console.log("Testing Copilot Chat (Feature B)...");
    const userMessage = "Which of my links has the most clicks?";
    const chatHistory = [
      { role: "user", content: "Hi there!" },
      { role: "assistant", content: "Hello! How can I help you manage your links today?" }
    ];
    const mockUserLinks = [
      { shortId: "test-xyz", originalUrl: "https://github.com/features/actions", clicks: 342 },
      { shortId: "launch-2026", originalUrl: "https://example.com/launch", clicks: 1250 }
    ];
    const userName = "Developer";

    const chatResult = await getCopilotChatResponse(userMessage, chatHistory, mockUserLinks, userName);
    console.log("✅ Chat Reply Received:\n");
    console.log(chatResult);
    console.log("\n--------------------------------------------------\n");

    console.log("🎉 All AI service tests passed successfully!");
  } catch (error) {
    console.error("❌ AI Service Test Failed:", error);
  }
}

runTests();