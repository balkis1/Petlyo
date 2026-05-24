// ─── State ────────────────────────────────────────────────────────────────────

const state = {
  currentPage: 'landing',
  currentStep: 1,
  totalSteps: 5,
  matchResults: [],
  currentSitterId: null,
  isDemoMode: false,
  petData: {
    petName: '', species: '', breed: '', age: '', city: '',
    traits: [],
    environment: [],
    feedingSchedule: '', exercise: '', medication: '',
    stayStart: '', stayEnd: '', extraNotes: '',
    ownerName: '', ownerEmail: ''
  }
};

// ─── Page Transitions ─────────────────────────────────────────────────────────

function showPage(id) {
  const current = document.querySelector('.page.active');
  const next = document.getElementById('page-' + id);
  if (!next || current === next) return;

  if (current) {
    current.classList.add('exiting');
    setTimeout(() => {
      current.classList.remove('active', 'exiting');
    }, 300);
  }

  setTimeout(() => {
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, current ? 150 : 0);

  state.currentPage = id;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

function goToStep(step) {
  const steps = document.querySelectorAll('.step-panel');
  steps.forEach(s => s.classList.remove('active'));

  const target = document.getElementById('step-' + step);
  if (target) target.classList.add('active');

  state.currentStep = step;
  updateProgress(step);
}

function updateProgress(step) {
  const pct = ((step - 1) / (state.totalSteps - 1)) * 100;
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = pct + '%';

  const counter = document.getElementById('step-counter');
  if (counter) counter.textContent = `Step ${step} of ${state.totalSteps}`;

  const prevBtn = document.getElementById('btn-prev');
  if (prevBtn) {
    prevBtn.style.visibility = 'visible';
    prevBtn.textContent = step === 1 ? '← Home' : '← Back';
  }

  const nextBtn = document.getElementById('btn-next');
  if (nextBtn) nextBtn.textContent = step === state.totalSteps ? 'Find my matches' : 'Continue';
}

function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('input-petName').value.trim();
    const species = document.getElementById('input-species').value;
    const city = document.getElementById('input-city').value.trim();
    if (!name) { flashError('input-petName', "Please enter your pet's name"); return false; }
    if (!species) { flashError('input-species', 'Please select a species'); return false; }
    if (!city) { flashError('input-city', 'Please enter your city'); return false; }
  }
  if (step === 5) {
    const ownerName = document.getElementById('input-ownerName').value.trim();
    const ownerEmail = document.getElementById('input-ownerEmail').value.trim();
    if (!ownerName) { flashError('input-ownerName', 'Please enter your name'); return false; }
    if (!ownerEmail || !ownerEmail.includes('@')) { flashError('input-ownerEmail', 'Please enter a valid email'); return false; }
  }
  return true;
}

function flashError(inputId, msg) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.add('input-error');
  let errEl = el.parentElement.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'field-error';
    el.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
  setTimeout(() => {
    el.classList.remove('input-error');
    errEl.remove();
  }, 3000);
}

function collectStepData(step) {
  if (step === 1) {
    state.petData.petName = document.getElementById('input-petName').value.trim();
    state.petData.species = document.getElementById('input-species').value;
    state.petData.breed = document.getElementById('input-breed').value.trim();
    state.petData.age = document.getElementById('input-age').value.trim();
    state.petData.city = document.getElementById('input-city').value.trim();
  }
  if (step === 4) {
    state.petData.feedingSchedule = document.getElementById('input-feeding').value;
    state.petData.exercise = document.getElementById('input-exercise').value.trim();
    state.petData.medication = document.getElementById('input-medication').value.trim();
    state.petData.stayStart = document.getElementById('input-stayStart').value;
    state.petData.stayEnd = document.getElementById('input-stayEnd').value;
    state.petData.extraNotes = document.getElementById('input-notes').value.trim();
  }
  if (step === 5) {
    state.petData.ownerName = document.getElementById('input-ownerName').value.trim();
    state.petData.ownerEmail = document.getElementById('input-ownerEmail').value.trim();
  }
}

function nextStep() {
  if (!validateStep(state.currentStep)) return;
  collectStepData(state.currentStep);

  if (state.currentStep === state.totalSteps) {
    startMatching();
    return;
  }
  goToStep(state.currentStep + 1);
}

function prevStep() {
  if (state.currentStep > 1) goToStep(state.currentStep - 1);
}

// ─── Multi-select Cards ───────────────────────────────────────────────────────

function initSelectCards() {
  document.querySelectorAll('.select-card').forEach(card => {
    card.addEventListener('click', () => {
      const group = card.dataset.group;
      const value = card.dataset.value;
      card.classList.toggle('selected');

      const arr = group === 'traits' ? state.petData.traits : state.petData.environment;
      const idx = arr.indexOf(value);
      if (idx === -1) arr.push(value);
      else arr.splice(idx, 1);
    });
  });
}

// ─── Matching Animation ───────────────────────────────────────────────────────

const MATCH_STEPS = [
  'Reading personality profile',
  'Scoring environment compatibility',
  'Filtering 140+ sitters',
  'Generating insight',
  'Ranking top matches'
];

function runDemo() {
  state.isDemoMode = true;
  Object.assign(state.petData, {
    petName: 'Luna',
    species: 'cat',
    breed: 'Domestic Shorthair',
    age: '2',
    city: 'Austin, TX',
    traits: ['anxious', 'shy', 'rescueTrauma'],
    environment: ['calm/quiet', 'only pet', 'sitter home all day'],
    feedingSchedule: '2x daily',
    exercise: 'Indoor play only',
    medication: 'None',
    stayStart: '2026-06-01',
    stayEnd: '2026-06-07',
    extraNotes: 'Rescue cat, needs patience and a calm, quiet home.',
    ownerName: 'Demo User',
    ownerEmail: 'demo@petlyo.com'
  });
  startMatching();
}

function startMatching() {
  showPage('matching');
  setTimeout(runMatchingAnimation, 400);
}

function runMatchingAnimation() {
  const container = document.getElementById('match-steps-list');
  container.innerHTML = '';

  MATCH_STEPS.forEach((text, i) => {
    const li = document.createElement('li');
    li.className = 'match-step';
    li.id = 'match-step-' + i;
    li.innerHTML = `<span class="match-step-icon pending"></span><span>${text}</span>`;
    container.appendChild(li);
  });

  let i = 0;
  function tick() {
    if (i >= MATCH_STEPS.length) {
      setTimeout(finishMatching, 600);
      return;
    }
    const li = document.getElementById('match-step-' + i);
    li.querySelector('.match-step-icon').className = 'match-step-icon done';
    li.classList.add('checked');
    i++;
    setTimeout(tick, 900);
  }
  setTimeout(tick, 300);
}

function finishMatching() {
  state.matchResults = getTopMatches(state.petData);
  renderResults();
  showPage('results');
  const demoBanner = document.getElementById('demo-banner');
  if (demoBanner) demoBanner.style.display = state.isDemoMode ? 'flex' : 'none';
}

// ─── Results ──────────────────────────────────────────────────────────────────

function renderResults() {
  // Pet banner
  const bannerName = document.getElementById('results-pet-name');
  if (bannerName) bannerName.textContent = state.petData.petName || 'Your pet';

  const bannerCity = document.getElementById('results-pet-city');
  if (bannerCity) bannerCity.textContent = state.petData.city || '';

  const tagsEl = document.getElementById('results-trait-tags');
  if (tagsEl) {
    const allTags = [
      ...state.petData.traits.map(t => TRAIT_LABELS[t]),
      ...state.petData.environment.map(e => ENV_LABELS[e])
    ].filter(Boolean);
    tagsEl.innerHTML = allTags.map(t => `<span class="tag">${t}</span>`).join('');
  }

  // Species badge + avatar emoji
  const SPECIES_EMOJI = { dog: '🐕', cat: '🐈', rabbit: '🐰', bird: '🐦', reptile: '🦎', other: '🐾' };
  const speciesBadge = document.getElementById('results-species');
  if (speciesBadge && state.petData.species) {
    speciesBadge.textContent = SPECIES_LABELS[state.petData.species] || state.petData.species;
  }
  const petAvatarEl = document.getElementById('results-pet-avatar');
  if (petAvatarEl && state.petData.species) {
    petAvatarEl.textContent = SPECIES_EMOJI[state.petData.species] || '🐾';
  }

  // AI insight
  const insightEl = document.getElementById('results-insight');
  if (insightEl) insightEl.textContent = generateInsight(state.petData);

  // Sitter cards
  const cardsEl = document.getElementById('results-cards');
  if (cardsEl) {
    cardsEl.innerHTML = state.matchResults.map((sitter, i) =>
      renderSitterCard(sitter, i + 1)
    ).join('');

    cardsEl.querySelectorAll('.sitter-card-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = parseInt(e.currentTarget.dataset.id);
        showSitterDetail(id);
      });
    });
  }
}

function renderSitterCard(sitter, rank) {
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  const specialties = sitter.specialties.slice(0, 2).map(s =>
    `<span class="specialty-tag">${s}</span>`
  ).join('');

  return `
    <article class="sitter-card" style="--rank-delay: ${(rank - 1) * 0.12}s">
      <div class="sitter-card-header">
        <div class="sitter-avatar" style="background:${sitter.avatarColor}">${sitter.initials}</div>
        <div class="sitter-card-meta">
          <div class="sitter-card-top">
            <h3 class="sitter-card-name">${sitter.name}</h3>
            <div class="sitter-score">
              <span class="score-value">${sitter.matchScore}%</span>
              <span class="score-label">match</span>
            </div>
          </div>
          <p class="sitter-location">${sitter.neighborhood}, ${sitter.city}</p>
          <div class="sitter-meta-row">
            <span>${sitter.yearsExperience} yrs experience</span>
            <span class="dot">·</span>
            <span>${sitter.numberOfStays} stays</span>
            <span class="dot">·</span>
            <span>★ ${sitter.rating}</span>
          </div>
          <div class="specialty-tags">${specialties}</div>
        </div>
      </div>
      <p class="sitter-reason">
        <span class="reason-label">Why they match</span>
        ${sitter.matchReason}
      </p>
      <button class="btn btn-outline sitter-card-btn" data-id="${sitter.id}">View profile →</button>
    </article>
  `;
}

// ─── Sitter Detail ────────────────────────────────────────────────────────────

function showSitterDetail(id) {
  const sitter = state.matchResults.find(s => s.id === id) ||
                 SITTERS.find(s => s.id === id);
  if (!sitter) return;
  state.currentSitterId = id;

  document.getElementById('sitter-avatar').textContent = sitter.initials;
  document.getElementById('sitter-avatar').style.background = sitter.avatarColor;
  document.getElementById('sitter-name').textContent = sitter.name;
  document.getElementById('sitter-location').textContent = `${sitter.neighborhood}, ${sitter.city}`;
  document.getElementById('sitter-rating').textContent = `★ ${sitter.rating}`;
  document.getElementById('sitter-stays').textContent = `${sitter.numberOfStays} stays`;
  document.getElementById('sitter-bio').textContent = sitter.bio;

  // Match score badge — only show when sitter came from a match
  const matchBadge = document.getElementById('detail-match-badge');
  const matchScoreEl = document.getElementById('detail-match-score');
  if (sitter.matchScore && matchBadge && matchScoreEl) {
    matchScoreEl.textContent = sitter.matchScore + '%';
    matchBadge.style.display = 'inline-flex';
  } else if (matchBadge) {
    matchBadge.style.display = 'none';
  }

  document.getElementById('detail-env-type').textContent = sitter.environmentType;
  document.getElementById('detail-other-pets').textContent = sitter.otherPets;
  document.getElementById('detail-home-all-day').textContent = sitter.homeAllDay ? 'Yes, always home' : 'Part of the day';
  document.getElementById('detail-experience').textContent = `${sitter.yearsExperience} years`;

  const specialtiesEl = document.getElementById('detail-specialties');
  if (specialtiesEl) {
    specialtiesEl.innerHTML = sitter.specialties.map(s =>
      `<span class="specialty-tag">${s}</span>`
    ).join('');
  }

  const breakdown = sitter.breakdown || computeCompatibilityBreakdown(sitter, state.petData);
  document.getElementById('bar-environment').dataset.target = breakdown.environment;
  document.getElementById('bar-energy').dataset.target = breakdown.energy;
  document.getElementById('bar-routine').dataset.target = breakdown.routine;
  document.getElementById('bar-experience').dataset.target = breakdown.experience;

  document.getElementById('bar-environment-pct').textContent = breakdown.environment + '%';
  document.getElementById('bar-energy-pct').textContent = breakdown.energy + '%';
  document.getElementById('bar-routine-pct').textContent = breakdown.routine + '%';
  document.getElementById('bar-experience-pct').textContent = breakdown.experience + '%';

  showPage('sitter');

  setTimeout(() => {
    ['bar-environment', 'bar-energy', 'bar-routine', 'bar-experience'].forEach((barId, i) => {
      setTimeout(() => {
        const bar = document.getElementById(barId);
        if (bar) bar.style.width = bar.dataset.target + '%';
      }, i * 180);
    });
  }, 400);
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

const TRAIT_LABELS = {
  anxious: 'Anxious',
  social: 'Social',
  highEnergy: 'High energy',
  shy: 'Shy',
  senior: 'Senior',
  separationAnxiety: 'Separation anxiety',
  rescueTrauma: 'Rescue / trauma',
  playful: 'Playful'
};

const ENV_LABELS = {
  'only pet': 'Only pet',
  'garden access': 'Garden access',
  'calm/quiet': 'Calm & quiet',
  'sitter home all day': 'Sitter home all day',
  'dog-friendly': 'Dog-friendly',
  'no small children': 'No small children'
};

const SPECIES_LABELS = {
  dog: 'Dog', cat: 'Cat', rabbit: 'Rabbit',
  bird: 'Bird', reptile: 'Reptile', other: 'Other'
};

// ─── Toast ────────────────────────────────────────────────────────────────────

let toastTimer = null;

function showToast(message, durationMs = 3000) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), durationMs);
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  initSelectCards();
  updateProgress(1);

  // Nav scroll shadow
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // CTA buttons → onboarding
  document.querySelectorAll('[data-action="start"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.isDemoMode = false;
      const demoBanner = document.getElementById('demo-banner');
      if (demoBanner) demoBanner.style.display = 'none';
      goToStep(1);
      showPage('onboarding');
    });
  });

  // Demo buttons
  document.querySelectorAll('[data-action="demo"]').forEach(btn => {
    btn.addEventListener('click', runDemo);
  });

  // Logo / home buttons on inner pages
  document.querySelectorAll('[data-action="home"]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.isDemoMode = false;
      const demoBanner = document.getElementById('demo-banner');
      if (demoBanner) demoBanner.style.display = 'none';
      showPage('landing');
    });
  });

  // Onboarding nav
  document.getElementById('btn-next').addEventListener('click', nextStep);
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (state.currentStep === 1) {
      state.isDemoMode = false;
      showPage('landing');
    } else {
      prevStep();
    }
  });

  // Back from results
  document.getElementById('btn-start-over').addEventListener('click', () => {
    state.isDemoMode = false;
    const demoBanner = document.getElementById('demo-banner');
    if (demoBanner) demoBanner.style.display = 'none';
    Object.assign(state.petData, {
      petName: '', species: '', breed: '', age: '', city: '',
      traits: [], environment: [],
      feedingSchedule: '', exercise: '', medication: '',
      stayStart: '', stayEnd: '', extraNotes: '',
      ownerName: '', ownerEmail: ''
    });
    document.querySelectorAll('.select-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('input, select, textarea').forEach(el => { el.value = ''; });
    showPage('landing');
  });

  document.getElementById('btn-refine').addEventListener('click', () => {
    goToStep(1);
    showPage('onboarding');
  });

  // Back from sitter detail
  document.getElementById('btn-back-to-results').addEventListener('click', () => {
    showPage('results');
  });

  // Request a stay
  document.getElementById('btn-request-stay').addEventListener('click', () => {
    const sitter = state.matchResults.find(s => s.id === state.currentSitterId) ||
                   SITTERS.find(s => s.id === state.currentSitterId);
    if (sitter) {
      document.getElementById('modal-sitter-name').textContent = sitter.name;
    }
    openModal('modal-request');
  });

  // Modal close
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    closeModal('modal-request');
    showToast('✓ Request sent — we\'ll be in touch!');
  });

  // Close modal on overlay click
  document.getElementById('modal-request').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal('modal-request');
  });

  // Reset bars so they animate on each visit
  document.querySelectorAll('.compat-bar-fill').forEach(bar => {
    bar.style.width = '0%';
  });
}

document.addEventListener('DOMContentLoaded', init);
