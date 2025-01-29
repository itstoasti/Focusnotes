-- Add nickname and clicks columns to short_links table
alter table public.short_links
  add column nickname text,
  add column clicks integer not null default 0;

-- Add user_id column and make it nullable for now
alter table public.short_links
  add column user_id uuid references auth.users(id);

-- Update existing links to have the current user's ID
update public.short_links
set user_id = auth.uid()
where user_id is null;

-- Create policies for authenticated users
create policy "Authenticated users can update their own links"
  on public.short_links for update
  using (auth.uid() = user_id OR user_id is null)
  with check (true);

create policy "Authenticated users can create links"
  on public.short_links for insert
  with check (auth.uid() = user_id OR user_id is null);

create policy "Anyone can read links"
  on public.short_links for select
  using (true); 