# Backend Setup

## Authentication

The app uses Supabase Auth with the Supabase SSR cookie client. The browser uses the publishable/anon key; authenticated server routes read the user from the session cookie.

- `/login` supports email/password, registration, Google, and Discord.
- Signed-in members can request promotion from **Password and security → Activate Admin** by entering the site admin key.
- Successful member login and OAuth return to `/`.
- Email confirmation uses `/auth/callback`; the allowed redirect URL must include `http://localhost:3000/auth/callback` and the production equivalent in Supabase Auth URL Configuration.
- `/login?mode=admin` displays Admin mode on the shared login page. `/admin/login` redirects there.
- Admin access requires an authenticated Supabase user, the site-level `ADMIN_ACCESS_KEY`, and a `profiles.role` of `admin` or `owner`.
- After verification, the server issues a user-bound, HttpOnly, SameSite=Strict admin cookie for 15 minutes. Middleware checks both the Supabase role and this cookie for every `/admin` request. Signing out or switching to Member mode revokes the admin cookie.
- The activation API derives the user's UUID only from `auth.getUser()`. On a correct key, it uses the server-only Supabase admin client to update only that UUID's row from `member` to `admin`; client-supplied IDs and roles are ignored/not accepted. Owners and existing admins retain their roles.

Generate a random key locally:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Set it as `ADMIN_ACCESS_KEY` in `.env.local` and your deployment host's server-side environment. It must be at least 32 bytes, must not have a `NEXT_PUBLIC_` prefix, and must never be committed. The current implementation uses one shared site-level key in addition to per-user admin roles; it does not issue individual admin keys.

Promote an existing account from the Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = 'USER_UUID';
```

Use `owner` instead of `admin` for the owner role. Never grant these roles based only on client-side input.

## API Routes

| Route | Method | Authentication and behavior |
| --- | --- | --- |
| `/api/admin/activate` | `POST` | Requires a Supabase session and JSON `{ "key": "..." }`. Derives the UUID from the session, checks the role and key server-side, promotes only that user's member row, and issues the short-lived admin cookie. Incorrect keys never change the role. |
| `/api/admin/verify-key` | `POST` | Legacy admin login check. Requires an already-admin/owner profile and verifies the site key; does not promote members. |
| `/api/admin/revoke-key` | `POST` | Clears the admin verification cookie. |
| `/api/assets/view` | `GET` | Requires an authenticated user, but currently returns a placeholder message. It does not yet create or return a signed asset URL. |
| `/api/assets/download` | `GET` | Requires an authenticated user, but currently returns a placeholder message. It does not yet create a signed download URL or record a download event. |

The asset view/download routes are not complete production delivery flows. Do not expose private storage objects or claim signed preview/download is active until those routes implement asset lookup, authorization, signed URL creation, and (for downloads) event recording.

Example promotion request after a Supabase session has been established:

```ts
await fetch("/api/admin/activate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: adminAccessKey }),
});
```

## Storage

### Profile images

Run `supabase/avatars.sql`. It creates the public `avatars` bucket with a 5 MB limit and JPEG, PNG, WebP, and AVIF MIME types. Avatar and banner uploads are stored under the authenticated user's UUID folder, for example `<user-uuid>/banners/<file>`. Storage policies allow public reads and restrict insert, update, and delete to that user's folder. The uploaded public URL is saved to Supabase Auth user metadata when the profile is saved.

### Asset files

Create a private Storage bucket named `assets` in the Supabase dashboard. Keep it private. The current `schema.sql` configures row-level security for asset metadata, but it does not configure `storage.objects` policies for this bucket, and the view/download API handlers are placeholders. Until both are implemented, private asset upload, preview, and download are not complete end-to-end flows.

Never send the Supabase service-role key to a browser. User-facing operations should use the session client and RLS. The current code does not read `SUPABASE_SERVICE_ROLE_KEY`.

## Database SQL

### New Supabase project

1. Run `supabase/schema.sql` once to create profiles, assets, download events, wishlist data, indexes, triggers, table RLS policies, and restricted profile column grants.
2. Run `supabase/avatars.sql` to configure profile image storage and its policies.
3. Create the private `assets` storage bucket separately in the Supabase dashboard.
4. Configure Auth providers and URL allowlists.
5. Promote the initial owner using the SQL above; members can request admin promotion with `ADMIN_ACCESS_KEY` after the incremental grants migration is applied.

`schema.sql` is intended for a new project. Its policies and trigger are not fully idempotent; do not rerun the whole file on an existing installation. For incremental setup, use the focused scripts:

- `supabase/avatars.sql` configures the profile image bucket and policies.
- `supabase/wishlist.sql` adds the wishlist table and user-owned RLS policies.
- `supabase/admin-promotion.sql` revokes browser `UPDATE` on `profiles.role` while preserving the limited profile-field grants. Run this on existing installations before enabling self-service promotion.

The `wishlists` table stores one `(user_id, asset_id)` row per saved asset. Users can read, add, and remove only their own entries. Profile settings update Supabase Auth user metadata; `profiles.role` is not client-writable. Promotion uses the server-only `SUPABASE_SERVICE_ROLE_KEY` only after authenticating the user's session and validating the admin key.

## Environment Variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser/server | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser/server | Publishable key; permissions are constrained by RLS. |
| `NEXT_PUBLIC_SITE_URL` | Browser/server | Canonical site origin used for metadata and deployment configuration. |
| `ADMIN_ACCESS_KEY` | Server only | Shared high-entropy key for the additional admin sign-in check. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Used only by the admin-promotion API to update the authenticated user's role after checks. Never expose it publicly. |

Keep `.env.local` and deployment secrets out of source control. `.env.example` should contain names and blank values only.
