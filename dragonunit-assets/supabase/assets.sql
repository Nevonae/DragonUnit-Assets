insert into storage.buckets (id, name, public)
values ('assets', 'assets', false)
on conflict (id) do update
set public = false;

drop policy if exists "Admins and owners can view asset objects" on storage.objects;
create policy "Admins and owners can view asset objects"
on storage.objects for select to authenticated
using (
  bucket_id = 'assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'owner')
  )
);

drop policy if exists "Admins and owners can upload asset objects" on storage.objects;
create policy "Admins and owners can upload asset objects"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'owner')
  )
);

drop policy if exists "Admins and owners can update asset objects" on storage.objects;
create policy "Admins and owners can update asset objects"
on storage.objects for update to authenticated
using (
  bucket_id = 'assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'owner')
  )
)
with check (
  bucket_id = 'assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'owner')
  )
);

drop policy if exists "Admins and owners can delete asset objects" on storage.objects;
create policy "Admins and owners can delete asset objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'assets'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'owner')
  )
);
