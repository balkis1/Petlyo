// ── Petlyo Auth (Supabase) ────────────────────────────────────────────────────

const SUPA_URL = 'https://iqvmxobpldzzmzktudlw.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxdm14b2JwbGR6em16a3R1ZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTI3NTIsImV4cCI6MjA5NTIyODc1Mn0.3svVHqPLYz9CweJqZqxAexryd5cLpDTs3XIGCRMgKTE';

let sb = null;
try {
  sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
} catch(e) {
  console.error('Supabase failed to init:', e);
}

let isSignUp = true;
let authRole = 'owner';

const modal      = document.getElementById('modal-auth');
const btnAuth    = document.getElementById('btn-auth');
const btnStart   = document.getElementById('btn-get-started');
const authClose  = document.getElementById('auth-close');
const authTitle  = document.getElementById('auth-title');
const authSub    = document.getElementById('auth-sub');
const authSubmit = document.getElementById('auth-submit');
const toggleBtn  = document.getElementById('auth-toggle-btn');
const toggleP    = document.querySelector('.auth-toggle');
const errorEl    = document.getElementById('auth-error');
const emailEl    = document.getElementById('auth-email');
const passEl     = document.getElementById('auth-password');
const navUser    = document.getElementById('nav-user');
const navAvatar  = document.getElementById('nav-avatar');
const navName    = document.getElementById('nav-dropdown-name');
const navRole    = document.getElementById('nav-dropdown-role');
const btnLogout  = document.getElementById('btn-logout');
const rolePicker = document.getElementById('auth-role-picker');

// ── Open / close ──────────────────────────────────────────────────────────────
function openAuth() {
  modal.style.display = 'flex';
  modal.classList.add('open');
  setTimeout(() => emailEl?.focus(), 100);
}

function closeAuth() {
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 200);
  errorEl.style.display = 'none';
  if (emailEl) emailEl.value = '';
  if (passEl)  passEl.value  = '';
}

btnAuth?.addEventListener('click', openAuth);
authClose?.addEventListener('click', closeAuth);
modal?.addEventListener('click', e => { if (e.target === modal) closeAuth(); });

// ── Role picker ───────────────────────────────────────────────────────────────
document.querySelectorAll('.auth-role-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.auth-role-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    authRole = card.dataset.role;
  });
});

// ── Toggle sign-up / sign-in ──────────────────────────────────────────────────
function setMode(signup) {
  isSignUp = signup;
  errorEl.style.display = 'none';
  if (signup) {
    authTitle.textContent  = 'Create your account';
    authSub.textContent    = 'Save your pet profile and find your perfect sitter.';
    authSubmit.textContent = 'Create account';
    toggleBtn.textContent  = 'Sign in';
    toggleP.childNodes[0].textContent = 'Already have an account? ';
    if (rolePicker) rolePicker.style.display = 'block';
  } else {
    authTitle.textContent  = 'Welcome back';
    authSub.textContent    = 'Sign in to your Petlyo account.';
    authSubmit.textContent = 'Sign in';
    toggleBtn.textContent  = 'Create one';
    toggleP.childNodes[0].textContent = "Don't have an account? ";
    if (rolePicker) rolePicker.style.display = 'none';
  }
}

toggleBtn?.addEventListener('click', () => setMode(!isSignUp));

// ── Submit ────────────────────────────────────────────────────────────────────
authSubmit?.addEventListener('click', async () => {
  if (!sb) { showError('Auth service unavailable. Please refresh the page.'); return; }

  const email    = (emailEl?.value || '').trim();
  const password = passEl?.value || '';

  if (!email || !email.includes('@')) { showError('Please enter a valid email.'); return; }
  if (password.length < 6)            { showError('Password must be at least 6 characters.'); return; }

  authSubmit.textContent = 'Please wait…';
  authSubmit.disabled    = true;
  errorEl.style.display  = 'none';

  try {
    if (isSignUp) {
      const { data, error } = await sb.auth.signUp({
        email, password,
        options: { data: { role: authRole } }
      });
      if (error) { showError(error.message); return; }

      if (data.session) {
        // Email confirmation disabled — logged in immediately
        updateNavUser(data.user, authRole);
        closeAuth();
      } else {
        // Email confirmation required
        showError('✉️ Check your email and click the confirmation link, then sign in here.');
        setMode(false);
      }
    } else {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) { showError(error.message); return; }
      const role = data.user?.user_metadata?.role || 'owner';
      updateNavUser(data.user, role);
      closeAuth();
    }
  } catch (e) {
    showError('Something went wrong. Please try again.');
  } finally {
    authSubmit.textContent = isSignUp ? 'Create account' : 'Sign in';
    authSubmit.disabled    = false;
  }
});

// ── Sign out ──────────────────────────────────────────────────────────────────
btnLogout?.addEventListener('click', async () => {
  await sb.auth.signOut();
  navUser.style.display = 'none';
  btnAuth.style.display = 'inline-flex';
  if (btnStart) btnStart.style.display = 'inline-flex';
  document.getElementById('nav-dropdown').style.display = 'none';
});

// ── Nav avatar dropdown ───────────────────────────────────────────────────────
navAvatar?.addEventListener('click', e => {
  e.stopPropagation();
  const dd = document.getElementById('nav-dropdown');
  dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', e => {
  if (!navUser?.contains(e.target)) {
    const dd = document.getElementById('nav-dropdown');
    if (dd) dd.style.display = 'none';
  }
});

// ── Update nav after login ────────────────────────────────────────────────────
function updateNavUser(user, role) {
  const email    = user?.email || '';
  const initials = email.slice(0, 2).toUpperCase();
  if (navAvatar) navAvatar.textContent = initials;
  if (navName)   navName.textContent   = email;
  if (navRole)   navRole.textContent   = role === 'sitter' ? '🐾 Sitter' : '🏠 Pet Owner';
  if (navUser)   navUser.style.display = 'flex';
  if (btnAuth)   btnAuth.style.display = 'none';
  if (btnStart)  btnStart.style.display = 'none';
}

function showError(msg) {
  if (errorEl) {
    errorEl.textContent   = msg;
    errorEl.style.display = 'block';
  }
}

// ── Restore session on page load ──────────────────────────────────────────────
(async () => {
  if (!sb) return;
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) {
      const role = session.user.user_metadata?.role || 'owner';
      updateNavUser(session.user, role);
    }
  } catch (e) {}
})();
