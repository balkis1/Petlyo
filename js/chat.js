// ─── Petlyo AI Chat — LangChain agent backend ────────────────────────────────

const Chat = (() => {
  const BACKEND = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://petlyo-api.onrender.com';
  let isOpen      = false;
  let chatHistory = [];

  // ── Context ──────────────────────────────────────────────────────────────

  function pet()     { try { return (typeof state !== 'undefined' && state.petData)              ? state.petData      : null; } catch { return null; } }
  function sitters() { try { return (typeof state !== 'undefined' && state.matchResults?.length) ? state.matchResults : null; } catch { return null; } }
  function petName() { return pet()?.petName || 'your pet'; }

  // ── Backend call ─────────────────────────────────────────────────────────

  async function callAgent(message) {
    const ctrl = new AbortController();
    const tid  = setTimeout(() => ctrl.abort(), 35000);

    try {
      const res = await fetch(`${BACKEND}/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history:  chatHistory.slice(-12),
          pet_data: pet()     || {},
          sitters:  sitters() || [],
        }),
        signal: ctrl.signal,
      });

      clearTimeout(tid);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      return (await res.json()).reply;

    } catch (err) {
      clearTimeout(tid);
      throw err;
    }
  }

  // ── UI helpers ───────────────────────────────────────────────────────────

  function el(id) { return document.getElementById(id); }

  function addBubble(role, text) {
    const div = document.createElement('div');
    div.className   = `msg msg-${role}`;
    div.textContent = text;
    el('chat-messages').appendChild(div);
    scrollBottom();
    return div;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'msg msg-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    el('chat-messages').appendChild(div);
    scrollBottom();
    return div;
  }

  function scrollBottom() {
    const m = el('chat-messages');
    if (m) m.scrollTop = m.scrollHeight;
  }

  function setDisabled(on) {
    ['chat-input', 'chat-send'].forEach(id => {
      const e = el(id);
      if (e) e.disabled = on;
    });
  }

  // ── Suggestion chips ─────────────────────────────────────────────────────

  function showSuggestions() {
    const s = sitters();
    const chips = s
      ? [`Why is ${s[0].name.split(' ')[0]} ranked #1?`, 'Compare the top two', 'What should I ask them?']
      : ['How does matching work?', 'What makes a great sitter?', 'What should I pack?'];

    const wrap = document.createElement('div');
    wrap.className = 'chat-suggestions';
    chips.forEach(label => {
      const btn = document.createElement('button');
      btn.className   = 'chat-suggestion';
      btn.textContent = label;
      btn.addEventListener('click', () => { wrap.remove(); sendText(label); });
      wrap.appendChild(btn);
    });
    el('chat-messages').appendChild(wrap);
    scrollBottom();
  }

  // ── Send ─────────────────────────────────────────────────────────────────

  async function sendText(text) {
    addBubble('user', text);
    chatHistory.push({ role: 'user', content: text });
    setDisabled(true);
    const typing = addTyping();

    try {
      const reply = await callAgent(text);
      typing.remove();
      chatHistory.push({ role: 'assistant', content: reply });
      addBubble('ai', reply);
    } catch (err) {
      typing.remove();
      if (chatHistory[chatHistory.length - 1]?.role === 'user') chatHistory.pop();

      let msg;
      if (err.name === 'AbortError') {
        msg = 'That took too long — try again?';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        msg = 'Can\'t reach the backend. Is it running?\n\ncd backend && uvicorn main:app --reload';
      } else if (err.message.includes('503')) {
        msg = 'No LLM found. Add GROQ_API_KEY to backend/.env';
      } else {
        msg = `Something went wrong: ${err.message}`;
      }
      addBubble('ai', msg);
    }

    setDisabled(false);
    el('chat-input')?.focus();
  }

  function sendFromInput() {
    const inp = el('chat-input');
    if (!inp) return;
    const text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    sendText(text);
  }

  // ── Open / close ─────────────────────────────────────────────────────────

  function initChat() {
    const s = sitters(), p = pet();
    let welcome;
    if (s)              welcome = `Hi! 🐾 ${petName()}'s matches are ready. Ask me about any sitter, compare options, or ask anything pet-related.`;
    else if (p?.petName) welcome = `Hi! 🐾 I can see ${p.petName}'s profile. Ask me about matching, sitter selection, or pet care.`;
    else                welcome = `Hi! I'm Petlyo AI 🐾 Ask me anything about pet care, sitter matching, or how Petlyo works.`;

    addBubble('ai', welcome);
    showSuggestions();
    setDisabled(false);
    el('chat-input')?.focus();
  }

  function open() {
    isOpen = true;
    el('chat-panel').classList.add('open');
    el('chat-bubble').classList.add('active');
    if (!el('chat-messages').children.length) initChat();
    else scrollBottom();
  }

  function close() {
    isOpen = false;
    el('chat-panel').classList.remove('open');
    el('chat-bubble').classList.remove('active');
  }

  // ── Boot ─────────────────────────────────────────────────────────────────

  function init() {
    el('chat-bubble').addEventListener('click', () => isOpen ? close() : open());
    el('chat-close').addEventListener('click', close);
    el('chat-send').addEventListener('click', sendFromInput);
    el('chat-input').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) sendFromInput();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  return { open, close };
})();
