import React, { useState } from 'react';

const POSITIVE_WORDS = new Set([
  'happy', 'good', 'great', 'love', 'excellent', 'fantastic', 'wonderful', 'awesome', 'smile', 'glad'
]);
const NEGATIVE_WORDS = new Set([
  'sad', 'bad', 'terrible', 'hate', 'horrible', 'awful', 'angry', 'upset', 'depressed', 'cry'
]);

function detectEmotion(text) {
  const words = (text.toLowerCase().match(/\b\w+\b/g) || []);
  let pos = 0;
  let neg = 0;
  words.forEach((w) => {
    if (POSITIVE_WORDS.has(w)) pos += 1;
    if (NEGATIVE_WORDS.has(w)) neg += 1;
  });
  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

function stubContent(emotion, reasoning) {
  let base;
  switch (emotion) {
    case 'positive':
      base = "It's wonderful to hear that you're feeling positive.";
      break;
    case 'negative':
      base = "I'm sorry you're experiencing negative feelings.";
      break;
    default:
      base = "I understand.";
  }
  if (reasoning === 'minimal') {
    return base;
  } else if (reasoning === 'medium') {
    return `${base} I'm here to help with any questions you have.`;
  }
  return `${base} Let's explore the topic in more detail. I'm ready to assist with any aspect you want to discuss.`;
}

function applyVerbosity(content, level) {
  const sentences = content.split(/[.!?]/).map((s) => s.trim()).filter(Boolean);
  if (level === 'low') {
    return sentences[0] + '.';
  } else if (level === 'medium') {
    return sentences.slice(0, 2).join('. ') + '.';
  }
  return sentences.join('. ') + '.';
}

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [verbosity, setVerbosity] = useState('medium');
  const [reasoning, setReasoning] = useState('medium');

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    if (text.startsWith('/')) {
      const parts = text.split(/\s+/);
      if (parts[0] === '/generate' && parts[1] === 'sql' && parts.length >= 3) {
        const query = parts.slice(2).join(' ');
        const code = query.toLowerCase().startsWith('select') ? `${query};` : `SELECT ${query};`;
        setMessages([...messages, { sender: 'user', text }, { sender: 'assistant', text: code }]);
      } else if (parts[0] === '/generate' && parts[1] === 'python' && parts[2] === 'add' && parts.length === 5) {
        const a = Number(parts[3]);
        const b = Number(parts[4]);
        const code = isNaN(a) || isNaN(b)
          ? '# Invalid input: numbers required'
          : `def add(a, b):\n    return a + b\n\nresult = add(${a}, ${b})\nprint('Result:', result)`;
        setMessages([...messages, { sender: 'user', text }, { sender: 'assistant', text: code }]);
      } else {
        setMessages([...messages, { sender: 'user', text }, { sender: 'assistant', text: 'Unknown command.' }]);
      }
      setInput('');
      return;
    }
    const emotion = detectEmotion(text);
    const content = stubContent(emotion, reasoning);
    const reply = applyVerbosity(content, verbosity) + ` (${emotion})`;
    setMessages([...messages, { sender: 'user', text }, { sender: 'assistant', text: reply }]);
    setInput('');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: '20px auto' }}>
      <h1 style={{ textAlign: 'center' }}>NeuroSphere Chat (Web)</h1>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '4px 0' }}>
            <span style={{ display: 'inline-block', background: msg.sender === 'user' ? '#e0f0ff' : '#e0ffe0', padding: '4px 8px', borderRadius: '12px' }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        <select value={verbosity} onChange={(e) => setVerbosity(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select value={reasoning} onChange={(e) => setReasoning(e.target.value)}>
          <option value="minimal">Minimal</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          style={{ flexGrow: 1, padding: '4px 8px' }}
          placeholder="Type a message or command..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <p style={{ fontSize: '0.8em', color: '#666' }}>Use /generate sql &lt;query&gt; or /generate python add &lt;a&gt; &lt;b&gt; commands.</p>
    </div>
  );
}

export default App;
