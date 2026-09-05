import { useState, useRef, useEffect } from 'react';

const API_URL = '/ai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_AI_API_KEY;
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'my9';

const SYSTEM_PROMPT = `Kamu adalah asisten AI Midnight Community — komunitas esport Indonesia untuk Bloodstrike, Valorant, PUBG Mobile, dan Roblox. Jawab dengan ramah, singkat, dan membantu. Gunakan bahasa Indonesia kecuali user berbicara bahasa Inggris.`;

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Ada yang bisa dibantu tentang Midnight Community? 🎮' }
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
      const reply = data.choices?.[0]?.message?.content || 'Maaf, tidak bisa menjawab saat ini.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Koneksi ke AI gagal. Coba lagi nanti.' }]);
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
            <button onClick={() => setOpen(false)} aria-label="Tutup chat">×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="chat-msg chat-msg-assistant chat-typing">Mengetik...</div>}
            <div ref={bottomRef} />
          </div>
          <form className="chat-input" onSubmit={e => { e.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ketik pesan..."
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
