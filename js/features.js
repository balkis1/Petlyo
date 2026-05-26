// ── Petlyo — New Features: Symptom Checker, Pet Passport, Sitter Portal, Live Stay ──

const BACKEND = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000'
  : '/api';

// ════════════════════════════════════════════════════════
// SYMPTOM CHECKER
// ════════════════════════════════════════════════════════

(function initSymptomChecker() {
  const form     = document.getElementById('symptom-form');
  const resultEl = document.getElementById('symptom-result');
  const btnText  = document.getElementById('sym-btn-text');
  const badge    = document.getElementById('urgency-badge');
  const answer   = document.getElementById('symptom-answer');
  const again    = document.getElementById('sym-again');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const species  = document.getElementById('sym-species').value;
    const breed    = document.getElementById('sym-breed').value;
    const age      = document.getElementById('sym-age').value;
    const symptoms = document.getElementById('sym-symptoms').value;

    btnText.textContent = 'Analysing…';
    form.querySelector('.sym-submit').disabled = true;

    const langPrefix = window.currentLang === 'de' ? '[Bitte antworte auf Deutsch] ' : '';
    const message = langPrefix + `My ${species}${breed ? ` (${breed})` : ''}, aged ${age}, has the following symptoms: ${symptoms}.
Start your reply with exactly one of these urgency labels on its own line: MONITOR, VET SOON, or EMERGENCY. Then give your advice.`;

    try {
      const res = await fetch(`${BACKEND}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: [],
          pet_data: { species, breed, age },
          sitters: [],
        }),
      });
      const data = await res.json();
      const reply = data.reply || '';

      // Parse urgency from first line
      const lines = reply.split('\n').filter(l => l.trim());
      const first = lines[0].trim().toUpperCase();
      let level = 'monitor', label = '🟢 Monitor at home', cls = 'urgency-monitor';
      if (first.includes('EMERGENCY')) {
        level = 'emergency'; label = '🔴 Seek emergency care now'; cls = 'urgency-emergency';
      } else if (first.includes('VET')) {
        level = 'vet'; label = '🟡 See a vet soon'; cls = 'urgency-vet';
      }

      const bodyText = lines.slice(first.match(/^(MONITOR|VET SOON|VET|EMERGENCY)/i) ? 1 : 0).join('\n').trim();

      badge.textContent  = label;
      badge.className    = `urgency-badge ${cls}`;
      answer.textContent = bodyText;

      // Show emergency vet link only for emergencies
      const emergencyLink = document.getElementById('vet-emergency-link');
      if (emergencyLink) emergencyLink.style.display = level === 'emergency' ? 'flex' : 'none';

      form.style.display   = 'none';
      resultEl.style.display = 'block';
    } catch {
      answer.textContent = 'Could not reach the AI. Make sure the backend is running.';
      badge.textContent  = '⚠️ Connection error';
      badge.className    = 'urgency-badge urgency-vet';
      form.style.display   = 'none';
      resultEl.style.display = 'block';
    }

    btnText.textContent = 'Get instant advice →';
    form.querySelector('.sym-submit').disabled = false;
  });

  again?.addEventListener('click', () => {
    form.reset();
    form.style.display   = 'flex';
    resultEl.style.display = 'none';
  });
})();


// ════════════════════════════════════════════════════════
// PET PASSPORT
// ════════════════════════════════════════════════════════

const DEMO_PET = {
  petName: 'Luna', species: 'Cat', breed: 'Rescue mix', age: '3 years', city: 'Paris',
  traits: ['Curious', 'Gentle', 'Playful'],
  environment: ['Indoor only', 'Quiet home'],
  feedingSchedule: 'Twice daily', exercise: 'Indoor play · 20 min/day',
  medication: 'None', extraNotes: '',
};

function openPassport() {
  const raw = (typeof state !== 'undefined') ? state.petData : {};
  const p = (raw && raw.petName) ? raw : DEMO_PET;

  const speciesEmoji = { cat:'🐱', dog:'🐶', rabbit:'🐰', bird:'🦜', reptile:'🦎' };
  const emoji = speciesEmoji[(p.species||'').toLowerCase()] || '🐾';

  document.getElementById('pp-avatar').textContent  = emoji;
  document.getElementById('pp-name').textContent    = p.petName;
  document.getElementById('pp-species').textContent = p.species || '—';
  document.getElementById('pp-breed').textContent   = p.breed   || '—';
  document.getElementById('pp-age').textContent     = p.age     || '—';
  document.getElementById('pp-city').textContent    = p.city    || '—';
  document.getElementById('pp-feeding').textContent   = p.feedingSchedule || '—';
  document.getElementById('pp-exercise').textContent  = p.exercise || '—';
  document.getElementById('pp-medication').textContent = p.medication || 'None';
  document.getElementById('pp-env').textContent = (p.environment||[]).join(', ') || '—';

  const traitsEl = document.getElementById('pp-traits');
  traitsEl.innerHTML = (p.traits||[]).map(t => `<span class="passport-tag">${t}</span>`).join('') || '<span class="passport-tag" style="opacity:.5">No traits added</span>';

  const notesSection = document.getElementById('pp-notes-section');
  if (p.extraNotes) {
    document.getElementById('pp-notes').textContent = p.extraNotes;
    notesSection.style.display = 'block';
  } else {
    notesSection.style.display = 'none';
  }

  // Generate unique passport number from pet name + date
  const num = 'PET-' + Math.abs(p.petName.split('').reduce((a,c) => a + c.charCodeAt(0), Date.now() % 100000)).toString().slice(0,6);
  document.getElementById('pp-number').textContent = num;

  const m = document.getElementById('modal-passport');
  m.style.display = 'flex';
  m.classList.add('open');
}

document.getElementById('passport-close')?.addEventListener('click', () => {
  const m = document.getElementById('modal-passport');
  m.classList.remove('open');
  setTimeout(() => { m.style.display = 'none'; }, 200);
});
document.getElementById('modal-passport')?.addEventListener('click', e => {
  const m = document.getElementById('modal-passport');
  if (e.target === m) {
    m.classList.remove('open');
    setTimeout(() => { m.style.display = 'none'; }, 200);
  }
});
document.getElementById('btn-passport')?.addEventListener('click', openPassport);

document.getElementById('pp-copy')?.addEventListener('click', () => {
  const name = document.getElementById('pp-name').textContent.toLowerCase().replace(/\s+/g,'-');
  navigator.clipboard.writeText(`https://petlyo.com/pets/${name}`).catch(()=>{});
  const btn = document.getElementById('pp-copy');
  btn.textContent = '✓ Copied!';
  setTimeout(() => { btn.textContent = '🔗 Copy link'; }, 2000);
});

document.getElementById('pp-share')?.addEventListener('click', () => {
  const name = document.getElementById('pp-name').textContent;
  if (navigator.share) {
    navigator.share({ title: `${name}'s Pet Passport`, text: `Meet ${name} on Petlyo!`, url: 'https://petlyo.com' });
  } else {
    navigator.clipboard.writeText(`Meet ${name} on Petlyo! https://petlyo.com`).catch(()=>{});
    alert('Link copied to clipboard!');
  }
});


// ════════════════════════════════════════════════════════
// SITTER PORTAL
// ════════════════════════════════════════════════════════

document.querySelectorAll('.spec-chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

document.querySelectorAll('.avail-chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

document.getElementById('portal-form')?.addEventListener('submit', async e => {
  e.preventDefault();

  const specialties = [...document.querySelectorAll('.spec-chip.selected')].map(c => c.dataset.val);
  const availability = [...document.querySelectorAll('.avail-chip.selected')].map(c => c.dataset.day);
  const submitBtn = e.target.querySelector('.sym-submit');
  submitBtn.textContent = 'Submitting…';
  submitBtn.disabled = true;

  const payload = {
    name:        document.getElementById('p-name').value.trim(),
    city:        document.getElementById('p-city').value.trim(),
    experience:  document.getElementById('p-exp').value,
    homeType:    document.getElementById('p-home').value,
    ratePerDay:  document.getElementById('p-rate').value,
    presence:    document.getElementById('p-presence').value,
    availability,
    specialties,
    bio:         document.getElementById('p-bio').value.trim(),
    email:       document.getElementById('p-email').value.trim(),
    phone:       document.getElementById('p-phone').value.trim(),
  };

  try {
    await fetch(`${BACKEND}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // show success even if backend is down — data at least attempted
  }

  document.getElementById('portal-form-wrap').style.display = 'none';
  document.getElementById('portal-success').style.display  = 'block';
  submitBtn.textContent = 'Apply to join →';
  submitBtn.disabled = false;
});


// ════════════════════════════════════════════════════════
// LIVE STAY UPDATES
// ════════════════════════════════════════════════════════

const MOCK_UPDATES = [
  { time: 'Today · 09:14', emoji: '☀️', text: 'Good morning! Luna had her breakfast and is exploring the garden. She seems relaxed.' },
  { time: 'Today · 13:30', emoji: '😴', text: 'Nap time! She found her favourite sunny spot on the couch and has been sleeping for an hour.' },
  { time: 'Today · 16:45', emoji: '🎾', text: 'Playtime! We had a 20-minute play session with the feather toy — she was super energetic!' },
  { time: 'Yesterday · 20:00', emoji: '🍽️', text: 'Dinner eaten, all good. She is settling in really well — barely any hiding today.' },
];

function buildTimeline() {
  const el = document.getElementById('stay-timeline');
  if (!el) return;
  el.innerHTML = MOCK_UPDATES.map(u => `
    <div class="timeline-item">
      <div class="timeline-dot">${u.emoji}</div>
      <div class="timeline-content">
        <div class="timeline-time">${u.time}</div>
        <div class="timeline-text">${u.text}</div>
      </div>
    </div>
  `).join('');
}

async function generateStayReport() {
  const raw = (typeof state !== 'undefined') ? state.petData : null;
  const p = (raw && raw.petName) ? raw : DEMO_PET;
  const s = (typeof state !== 'undefined' && state.matchResults?.[0]) ? state.matchResults[0] : null;
  const reportEl = document.getElementById('stay-report-text');

  const petName    = p.petName;
  const sitterName = s?.name?.split(' ')[0] || 'Sophie';

  reportEl.textContent = 'Generating…';

  try {
    const res = await fetch(`${BACKEND}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: (window.currentLang === 'de' ? '[Bitte antworte auf Deutsch] ' : '') + `Write a warm, reassuring 2-sentence daily report for a pet owner. Their pet ${petName} is staying with ${sitterName}. Based on today's check-ins: ate well, played, napped, seems settled. Be specific, warm, and concise.`,
        history: [], pet_data: p || {}, sitters: [],
      }),
    });
    const data = await res.json();
    reportEl.textContent = data.reply || 'All looks great today! Luna ate well and had a lovely play session.';
  } catch {
    reportEl.textContent = `${petName} is doing great! Ate well, had a play session, and is settling in beautifully with ${sitterName}.`;
  }
}

function openStayModal() {
  const raw = (typeof state !== 'undefined') ? state.petData : null;
  const p = (raw && raw.petName) ? raw : DEMO_PET;
  const s = (typeof state !== 'undefined' && state.matchResults?.[0]) ? state.matchResults[0] : null;
  const petName    = p.petName;
  const sitterName = s?.name || 'Sophie';

  document.getElementById('stay-subtitle').textContent = `${petName} is with ${sitterName.split(' ')[0]} · Day 2 of 5`;
  buildTimeline();
  generateStayReport();
  document.getElementById('modal-stay').style.display = 'flex';
}

document.getElementById('stay-close')?.addEventListener('click', () => {
  document.getElementById('modal-stay').style.display = 'none';
});
document.getElementById('modal-stay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modal-stay'))
    document.getElementById('modal-stay').style.display = 'none';
});
document.getElementById('btn-live-stay')?.addEventListener('click', openStayModal);

document.getElementById('btn-checkin')?.addEventListener('click', () => {
  const btn = document.getElementById('btn-checkin');
  btn.textContent = '✓ Request sent! Sophie will send a photo soon.';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '📸 Request check-in from sitter';
    btn.disabled = false;
  }, 4000);
});

document.querySelectorAll('.mood-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});


// ════════════════════════════════════════════════════════
// VET CHAT MODAL
// ════════════════════════════════════════════════════════

(function initVetChat() {
  const modal    = document.getElementById('modal-vet-chat');
  const closeBtn = document.getElementById('vet-chat-close');
  const openBtn  = document.getElementById('btn-vet-chat');
  const notifyBtn = document.getElementById('vet-notify-btn');
  const notifyInput = document.getElementById('vet-notify-email');
  const notifySuccess = document.getElementById('vet-notify-success');

  if (!modal) return;

  openBtn?.addEventListener('click', () => { modal.style.display = 'flex'; });
  closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });
  modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  notifyBtn?.addEventListener('click', async () => {
    const email = notifyInput?.value.trim();
    if (!email || !email.includes('@')) { notifyInput.style.borderColor = '#e53e3e'; return; }
    notifyBtn.textContent = '…';
    notifyBtn.disabled = true;
    try {
      await fetch(`${BACKEND}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {}
    notifyInput.style.display = 'none';
    notifyBtn.style.display = 'none';
    if (notifySuccess) notifySuccess.style.display = 'block';
  });
})();


// ════════════════════════════════════════════════════════
// WAITLIST
// ════════════════════════════════════════════════════════

(function initWaitlist() {
  const form       = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('waitlist-email');
  const btn        = document.getElementById('waitlist-btn');
  const successEl  = document.getElementById('waitlist-success');
  const countText  = document.getElementById('waitlist-count-text');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    btn.textContent = 'Joining…';
    btn.disabled = true;

    try {
      const res  = await fetch(`${BACKEND}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      form.style.display     = 'none';
      successEl.style.display = 'flex';
    } catch {
      btn.textContent = 'Get early access →';
      btn.disabled = false;
      emailInput.style.borderColor = '#e53e3e';
      setTimeout(() => { emailInput.style.borderColor = ''; }, 3000);
    }
  });
})();


// ════════════════════════════════════════════════════════
// NAVIGATION WIRING
// ════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-action="symptoms"]').forEach(btn => {
    btn.addEventListener('click', () => showPage('symptoms'));
  });
  document.querySelectorAll('[data-action="sitter-portal"]').forEach(btn => {
    btn.addEventListener('click', () => showPage('sitter-portal'));
  });

  // inner-header back buttons (data-action="home")
  document.querySelectorAll('#page-symptoms [data-action="home"], #page-sitter-portal [data-action="home"]').forEach(btn => {
    btn.addEventListener('click', () => showPage('landing'));
  });
});
