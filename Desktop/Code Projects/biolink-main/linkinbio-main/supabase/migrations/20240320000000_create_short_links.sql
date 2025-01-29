create table public.short_links (
  id text primary key,
  long_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS (Row Level Security)
alter table public.short_links enable row level security;

-- Create policies
create policy "Anyone can create short links"
  on public.short_links for insert
  with check (true);

create policy "Anyone can read short links"
  on public.short_links for select
  using (true); 