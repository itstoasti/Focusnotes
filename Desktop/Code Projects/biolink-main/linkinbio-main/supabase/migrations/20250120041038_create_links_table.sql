create table "public"."links" (
  "id" uuid not null default gen_random_uuid(),
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "short_id" text not null,
  "data" jsonb not null,
  "clicks" integer not null default 0,
  "analytics" jsonb,
  
  constraint links_pkey primary key (id),
  constraint links_short_id_key unique (short_id)
);

-- Create index for faster lookups
create index links_user_id_idx on links(user_id);
create index links_short_id_idx on links(short_id);

-- Set up RLS (Row Level Security)
alter table "public"."links" enable row level security;

-- Create policies
create policy "Users can view their own links"
  on links for select
  using (auth.uid() = user_id);

create policy "Users can insert their own links"
  on links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on links for delete
  using (auth.uid() = user_id);
