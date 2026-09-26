begin;

revoke update on table public.profiles from public, anon, authenticated;
revoke update (id, display_name, avatar_url, role, created_at) on table public.profiles from public, anon, authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;

commit;
