import { useState } from 'react';
import aiApi from '../services/aiApi';
import './CopilotChat.css';

export default function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your LinkLite Copilot. How can I help you manage your links today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await aiApi.post('/ai/chat', {
        message: input,
        chatHistory: messages,
      });

      setMessages([...updatedMessages, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      console.error('Copilot chat request failed:', err);
      setMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, I encountered an error answering that.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="copilot-wrapper">
      {!isOpen && (
        <button className="copilot-toggle" onClick={() => setIsOpen(true)}>
          <span>💬 Ask Copilot</span>
        </button>
      )}

      {isOpen && (
        <div className="copilot-panel">
          <div className="copilot-header">
            <h3>LinkLite Copilot</h3>
            <button className="copilot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="copilot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`copilot-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="copilot-typing">Copilot is typing...</div>}
          </div>

          <form onSubmit={handleSendMessage} className="copilot-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your links..."
              className="copilot-input"
            />
            <button type="submit" disabled={loading} className="copilot-send">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
