import { User, Transaction } from "@/types";

// Global in-memory store — persists for the lifetime of the Node.js process.
// Works great for low-traffic, short-duration use (e.g. 5 users, 2 days).
// Note: resets on cold start / Vercel redeploy.

declare global {
  // eslint-disable-next-line no-var
  var __store: Store | undefined;
}

interface Store {
  users: Map<string, User>;
  transactions: Transaction[];
}

function createStore(): Store {
  return {
    users: new Map(),
    transactions: [],
  };
}

// Reuse the same store across hot-reloads in dev
if (!global.__store) {
  global.__store = createStore();
}

const store = global.__store;

// ── Users ──────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  return Array.from(store.users.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function getUserById(id: string): User | undefined {
  return store.users.get(id);
}

export function getUserByName(name: string): User | undefined {
  return Array.from(store.users.values()).find(
    (u) => u.name.toLowerCase() === name.toLowerCase()
  );
}

export function createUser(name: string, initialBalance: number): User {
  const id = crypto.randomUUID();
  const user: User = {
    id,
    name: name.trim(),
    balance: initialBalance,
    createdAt: new Date().toISOString(),
  };
  store.users.set(id, user);
  return user;
}

// ── Transactions ───────────────────────────────────────────────────────────

export function getTransactions(): Transaction[] {
  return [...store.transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function executeTrade(
  fromId: string,
  toId: string,
  amount: number,
  note: string
): { ok: true; tx: Transaction } | { ok: false; error: string } {
  const from = store.users.get(fromId);
  const to = store.users.get(toId);

  if (!from) return { ok: false, error: "Sender not found." };
  if (!to) return { ok: false, error: "Recipient not found." };
  if (fromId === toId) return { ok: false, error: "Cannot send to yourself." };
  if (amount <= 0) return { ok: false, error: "Amount must be greater than 0." };
  if (from.balance < amount) return { ok: false, error: `Insufficient balance. You have ${from.balance} AUC.` };

  from.balance -= amount;
  to.balance += amount;

  const tx: Transaction = {
    id: crypto.randomUUID(),
    fromId,
    fromName: from.name,
    toId,
    toName: to.name,
    amount,
    note: note?.trim() || "",
    timestamp: new Date().toISOString(),
  };

  store.transactions.push(tx);
  return { ok: true, tx };
}
