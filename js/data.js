// ── Mock data ──────────────────────────────────────────────────

const OFFERWALLS = [
  { id: 1, category: 'SURVEYS', name: 'BitLabs Surveys', desc: 'Share your opinion on products & brands. High-paying surveys updated daily.', coins: 500, url: '#' },
  { id: 2, category: 'VIDEOS',  name: 'Lootably Videos', desc: 'Watch short video clips from top advertisers. Easy coins, no sign-up needed.', coins: 150, url: '#' },
  { id: 3, category: 'GAMES',   name: 'AdGem Games',     desc: 'Play mobile games and reach target levels to earn huge coin rewards.', coins: 1200, url: '#' },
  { id: 4, category: 'OFFERS',  name: 'CPALead Offers',  desc: 'Sign up for free trials and special promotions from top brands.', coins: 800, url: '#' },
  { id: 5, category: 'SURVEYS', name: 'Theorem Reach',   desc: 'Academic & consumer research surveys. Higher payouts for qualified responses.', coins: 650, url: '#' },
  { id: 6, category: 'OFFERS',  name: 'OfferToro',       desc: 'Complete app installs, registrations, and in-app milestones for big rewards.', coins: 950, url: '#' },
];

const CATEGORY_BADGE = {
  SURVEYS: 'badge-blue',
  VIDEOS:  'badge-orange',
  GAMES:   'badge-purple',
  OFFERS:  'badge-green',
};

function getTxs(userId) {
  const key = `ce_txs_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [
    { id: 1, type: 'CREDIT_OFFERWALL', amount: 500,  status: 'COMPLETED', note: 'BitLabs Surveys',  date: '2026-06-20' },
    { id: 2, type: 'CREDIT_OFFERWALL', amount: 1200, status: 'COMPLETED', note: 'AdGem Games',       date: '2026-06-18' },
    { id: 3, type: 'DEBIT_WITHDRAWAL', amount: 2500, status: 'COMPLETED', note: 'USDT TRC-20',       date: '2026-06-15' },
    { id: 4, type: 'CREDIT_REFERRAL',  amount: 250,  status: 'COMPLETED', note: 'Referral bonus',    date: '2026-06-10' },
    { id: 5, type: 'CREDIT_OFFERWALL', amount: 650,  status: 'COMPLETED', note: 'Theorem Reach',     date: '2026-06-05' },
  ];
}
function saveTxs(userId, txs) { localStorage.setItem(`ce_txs_${userId}`, JSON.stringify(txs)); }

function getWithdrawals(userId) {
  const key = `ce_wds_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [
    { id: 1, amount: 2500, walletType: 'USDT_TRC20', wallet: 'TQn8i...kZx3', status: 'COMPLETED', date: '2026-06-15' },
  ];
}
function saveWithdrawals(userId, wds) { localStorage.setItem(`ce_wds_${userId}`, JSON.stringify(wds)); }

// Admin: all users + their withdrawals
function getAllUsers() {
  return getUsers().map(u => ({
    ...u,
    withdrawals: getWithdrawals(u.id),
    txs: getTxs(u.id),
  }));
}

function getAllWithdrawals() {
  const users = getUsers();
  const result = [];
  users.forEach(u => {
    getWithdrawals(u.id).forEach(w => {
      result.push({ ...w, userEmail: u.email, userId: u.id });
    });
  });
  // Add some pending demo withdrawals for admin to review
  if (result.filter(w => w.status === 'PENDING').length === 0) {
    result.push(
      { id: 99, amount: 1000, walletType: 'TON',       wallet: 'EQBv...m7Kp', status: 'PENDING', date: '2026-06-25', userEmail: 'alice@gmail.com',   userId: 2 },
      { id: 98, amount: 3000, walletType: 'USDT_TRC20', wallet: 'TLqR...p9Wz', status: 'PENDING', date: '2026-06-24', userEmail: 'bob@yahoo.com',     userId: 3 },
    );
  }
  return result;
}

const TX_LABELS = { CREDIT_OFFERWALL: 'Offerwall', CREDIT_REFERRAL: 'Referral', DEBIT_WITHDRAWAL: 'Withdrawal' };
const STATUS_BADGE = { COMPLETED: 'badge-green', PENDING: 'badge-yellow', REJECTED: 'badge-red', Active: 'badge-green', Banned: 'badge-red' };
