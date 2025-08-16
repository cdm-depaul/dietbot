from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # needs service role for DDL

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# SQL to create table and index
schema_sql = """
create table if not exists public.chat_memory (
  id bigserial primary key,
  user_id bigint not null,
  role text not null check (role in ('system','user','assistant','tool')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_memory_user_created_at_idx
  on public.chat_memory (user_id, created_at);
"""

def init_chat_memory_table():
    try:
        res = supabase.rpc("exec_sql", {"sql": schema_sql}).execute()
        print("✅ chat_memory table initialized:", res)
    except Exception as e:
        print("⚠️ Could not create table:", e)

if __name__ == "__main__":
    init_chat_memory_table()