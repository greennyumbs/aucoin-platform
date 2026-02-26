import { User, Transaction } from "@/types";
import { supabase } from "./supabase";

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    balance: row.balance,
    createdAt: row.created_at,
  }));
}

export async function getUserById(id: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return undefined;

  return {
    id: data.id,
    name: data.name,
    balance: data.balance,
    createdAt: data.created_at,
  };
}

export async function getUserByName(name: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .ilike("name", name.trim())
    .single();

  if (error) return undefined;

  return {
    id: data.id,
    name: data.name,
    balance: data.balance,
    createdAt: data.created_at,
  };
}

export async function createUser(
  name: string,
  initialBalance: number
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: name.trim(),
      balance: initialBalance,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    balance: data.balance,
    createdAt: data.created_at,
  };
}

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    fromId: row.from_id,
    fromName: row.from_name,
    toId: row.to_id,
    toName: row.to_name,
    amount: row.amount,
    note: row.note ?? "",
    timestamp: row.timestamp,
  }));
}

export async function executeTrade(
  fromId: string,
  toId: string,
  amount: number,
  note: string
): Promise<{ ok: true; tx: Transaction } | { ok: false; error: string }> {
  const from = await getUserById(fromId);
  const to = await getUserById(toId);

  if (!from) return { ok: false, error: "Sender not found." };
  if (!to) return { ok: false, error: "Recipient not found." };
  if (fromId === toId) return { ok: false, error: "Cannot send to yourself." };
  if (amount <= 0)
    return { ok: false, error: "Amount must be greater than 0." };
  if (from.balance < amount)
    return {
      ok: false,
      error: `Insufficient balance. You have ${from.balance} AUC.`,
    };

  const { error: updateError } = await supabase.rpc("execute_trade", {
    p_from_id: fromId,
    p_to_id: toId,
    p_amount: amount,
    p_from_name: from.name,
    p_to_name: to.name,
    p_note: note?.trim() || "",
  });

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  const { data: txData, error: txError } = await supabase
    .from("transactions")
    .select("*")
    .eq("from_id", fromId)
    .eq("to_id", toId)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();

  if (txError) {
    return { ok: false, error: txError.message };
  }

  return {
    ok: true,
    tx: {
      id: txData.id,
      fromId: txData.from_id,
      fromName: txData.from_name,
      toId: txData.to_id,
      toName: txData.to_name,
      amount: txData.amount,
      note: txData.note ?? "",
      timestamp: txData.timestamp,
    },
  };
}
