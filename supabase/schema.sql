create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member','admin','owner')),
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category text not null,
  storage_path text not null,
  thumbnail_path text,
  file_name text not null,
  file_size bigint not null default 0,
  mime_type text not null,
  downloads integer not null default 0,
  views integer not null default 0,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.download_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, asset_id)
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_assets_category on public.assets(category);
create index if not exists idx_assets_created_at on public.assets(created_at desc);
create index if not exists idx_download_events_asset on public.download_events(asset_id);
create index if not exists idx_download_events_user on public.download_events(user_id);
create index if not exists idx_wishlists_asset on public.wishlists(asset_id);

alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.download_events enable row level security;
alter table public.wishlists enable row level security;

create policy "Profiles are viewable by everyone"
on public.profiles for select using (true);

create policy "Users can insert own profile"
on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

revoke update on table public.profiles from public, anon, authenticated;
revoke update (id, display_name, avatar_url, role, created_at) on table public.profiles from public, anon, authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;

create policy "Public read access to assets"
on public.assets for select using (true);

create policy "Authenticated users can create asset records"
on public.assets for insert with check (
  auth.uid() = created_by and (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')
    )
  )
);

create policy "Admins and owner can update assets"
on public.assets for update using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')
  )
) with check (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')
  )
);

create policy "Admins and owner can delete assets"
on public.assets for delete using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','owner')
  )
);

create policy "Users can see their own downloads"
on public.download_events for select using (auth.uid() = user_id);

create policy "Authenticated users can insert download events"
on public.download_events for insert with check (auth.uid() = user_id);

create policy "Users can view their own wishlist"
on public.wishlists for select using (auth.uid() = user_id);

create policy "Users can add to their own wishlist"
on public.wishlists for insert with check (auth.uid() = user_id);

create policy "Users can remove from their own wishlist"
on public.wishlists for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.get_asset_stats()
returns table (
  members bigint,
  assets bigint,
  downloads bigint,
  views bigint
)
language sql
security definer
set search_path = public
as $$
  select
    (select count(*) from public.profiles) as members,
    (select count(*) from public.assets) as assets,
    (select coalesce(sum(downloads),0) from public.assets) as downloads,
    (select coalesce(sum(views),0) from public.assets) as views;
$$;
