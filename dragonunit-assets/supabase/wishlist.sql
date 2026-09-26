create table if not exists public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, asset_id)
);

create index if not exists idx_wishlists_asset on public.wishlists(asset_id);
alter table public.wishlists enable row level security;

drop policy if exists "Users can view their own wishlist" on public.wishlists;
create policy "Users can view their own wishlist"
on public.wishlists for select using (auth.uid() = user_id);

drop policy if exists "Users can add to their own wishlist" on public.wishlists;
create policy "Users can add to their own wishlist"
on public.wishlists for insert with check (auth.uid() = user_id);

drop policy if exists "Users can remove from their own wishlist" on public.wishlists;
create policy "Users can remove from their own wishlist"
on public.wishlists for delete using (auth.uid() = user_id);