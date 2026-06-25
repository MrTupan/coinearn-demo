// ── Auth helpers ──────────────────────────────────────────────
const ADMIN_EMAIL = 'jamalarmani710@gmail.com';
const ADMIN_PASS  = 'jamal@123';

// Demo platform users (in-memory "database")
const DEMO_USERS = [
  { id: 1, email: 'jamalarmani710@gmail.com', password: 'jamal@123', name: 'Jamal Armani',
    balance: 4850, totalEarned: 7350, totalWithdrawn: 2500,
    referralCode: 'JAMAL01', joined: '2026-01-12', status: 'Active', isAdmin: true }
];

function getUsers() {
  const stored = localStorage.getItem('ce_users');
  return stored ? JSON.parse(stored) : DEMO_USERS;
}
function saveUsers(users) { localStorage.setItem('ce_users', JSON.stringify(users)); }

function getSession() {
  const s = localStorage.getItem('ce_session');
  return s ? JSON.parse(s) : null;
}
function setSession(user) { localStorage.setItem('ce_session', JSON.stringify(user)); }
function clearSession() { localStorage.removeItem('ce_session'); }

function requireAuth() {
  const s = getSession();
  if (!s) { window.location.href = 'login.html'; return null; }
  return s;
}
function requireGuest() {
  const s = getSession();
  if (s) { window.location.href = 'dashboard.html'; }
}
function requireAdmin() {
  const s = getSession();
  if (!s || !s.isAdmin) { window.location.href = 'admin-login.html'; return null; }
  return s;
}

function doLogin(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  setSession(user);
  return { ok: true, user };
}

function doLogout() { clearSession(); window.location.href = 'index.html'; }

// ── Toast ──────────────────────────────────────────────────────
function showToast(title, msg, type = 'success') {
  let el = document.getElementById('_toast');
  if (!el) {
    el = document.createElement('div');
    el.id = '_toast';
    el.className = 'toast';
    el.innerHTML = '<span class="toast-icon"></span><div class="toast-content"><strong></strong><span></span></div>';
    document.body.appendChild(el);
  }
  el.querySelector('.toast-icon').textContent = type === 'success' ? '✅' : '❌';
  el.querySelector('strong').textContent = title;
  el.querySelector('span').textContent = msg ?? '';
  el.className = `toast toast-${type} show`;
  setTimeout(() => el.classList.remove('show'), 3500);
}

// ── Nav balance updater ────────────────────────────────────────
function updateNavBalance() {
  const s = getSession();
  const el = document.getElementById('navBalance');
  if (el && s) el.textContent = `${s.balance.toLocaleString()} Coins`;
  const emailEl = document.getElementById('navEmail');
  if (emailEl && s) emailEl.textContent = s.email;
}

// ── Number helpers ─────────────────────────────────────────────
function fmt(n) { return Number(n).toLocaleString(); }
function fmtUsd(coins) { return '$' + (coins / 1000).toFixed(2); }
