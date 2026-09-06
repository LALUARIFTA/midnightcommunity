import { useState, useRef, useEffect } from 'react';

function formatMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^[-•]\s+(.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n/g, '<br/>');
}

const API_URL = '/ai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_AI_API_KEY;
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'my9';

const SYSTEM_PROMPT = `You are Midnight AI, the official assistant for Midnight Community.
Core Guidelines:
1. Answer ONLY questions related to Midnight Community (game divisions: Bloodstrike, Valorant, PUBG Mobile, Roblox; scrim schedule; Roster/Members; Rules; FAQ; and Registration/Discord guidance).
2. For off-topic questions, decline politely, professionally, and concisely: "Sorry, I can only help with questions regarding Midnight Community."
3. Provide professional, informative, and neatly structured responses (use bullet points/lists when applicable).
4. Use English for all communications.`;

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you regarding Midnight Community today? 🎮' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...next],
          max_tokens: 512,
          stream: false,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, unable to answer at the moment.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection to AI failed. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <strong>Midnight AI</strong>
              <span>Community Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}
                dangerouslySetInnerHTML={{ __html: formatMd(msg.content) }} />
            ))}
            {loading && <div className="chat-msg chat-msg-assistant chat-typing">Typing...</div>}
            <div ref={bottomRef} />
          </div>
          <form className="chat-input" onSubmit={e => { e.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>↑</button>
          </form>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Chat AI">
        {open ? '×' : '💬'}
      </button>
    </>
  );
}
