-- Run this in Supabase SQL Editor

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  balance integer not null default 0,
  created_at timestamptz default now()
);

-- Transactions table
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  from_id uuid references users(id),
  from_name text not null,
  to_id uuid references users(id),
  to_name text not null,
  amount integer not null,
  note text default '',
  timestamp timestamptz default now()
);

-- Enable RLS
alter table users enable row level security;
alter table transactions enable row level security;

-- Policies for public access (adjust as needed for your security requirements)
create policy "Allow public read access" on users for select using (true);
create policy "Allow public insert access" on users for insert with check (true);
create policy "Allow public update access" on users for update using (true);

create policy "Allow public read access" on transactions for select using (true);
create policy "Allow public insert access" on transactions for insert with check (true);

-- Execute trade function (atomic transaction)
create or replace function execute_trade(
  p_from_id uuid,
  p_to_id uuid,
  p_amount integer,
  p_from_name text,
  p_to_name text,
  p_note text
)
returns void
language plpgsql
as $$
begin
  update users set balance = balance - p_amount where id = p_from_id;
  update users set balance = balance + p_amount where id = p_to_id;
  
  insert into transactions (from_id, from_name, to_id, to_name, amount, note)
  values (p_from_id, p_from_name, p_to_id, p_to_name, p_amount, p_note);
end;
$$;
