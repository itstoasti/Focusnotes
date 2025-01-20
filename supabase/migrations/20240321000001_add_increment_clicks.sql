-- Create a function to safely increment the clicks counter
create or replace function increment_clicks(link_id text)
returns integer
language sql
security definer
as $$
  update public.short_links
  set clicks = clicks + 1
  where id = link_id
  returning clicks;
$$; 