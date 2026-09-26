# DragonUnit Assets

DragonUnit Assets is a Next.js asset library for creators, using Supabase Auth, PostgreSQL, role checks, profile image storage, and a private asset bucket.

## Local setup

1. Install Node.js 20+
2. Install dependencies:
   npm install
3. Copy `.env.example` to `.env.local`
4. Add your Supabase credentials
5. Run the app:
   npm run dev
6. Open http://localhost:3000

## Required environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_ACCESS_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is used only by the server-side admin promotion endpoint. Never expose it with a `NEXT_PUBLIC_` prefix or put it in client-side code.

## Supabase project setup

1. Create a Supabase project
2. Run the SQL in `supabase/schema.sql`
3. Run `supabase/avatars.sql` to create the public profile image bucket with user-scoped upload policies
4. Run `supabase/assets.sql` to create the private `assets` bucket and restrict storage-object writes to admins and owners
5. Configure row-level security and auth providers
6. Set Google and Discord OAuth providers

For an existing project, run `supabase/avatars.sql`, `supabase/assets.sql`, and `supabase/wishlist.sql` in the Supabase SQL Editor to configure profile images, admin-only asset storage writes, and the user-scoped wishlist.

## Google OAuth setup

Use the Google Cloud Console to create OAuth credentials, then add the callback URL from Supabase Auth:

- Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
- Production redirect URL: `https://your-domain.com/auth/callback` if using custom domain

Never put the Google client secret in frontend code.

## Discord OAuth setup

Create a Discord app in the Discord Developer portal, enable OAuth2, and add the callback URL from Supabase Auth:

- Redirect URL: `https://<project-ref>.supabase.co/auth/v1/callback`

## Email auth setup

Enable email/password sign-in in Supabase Auth and set your app URL.

## Owner setup

After a user signs in for the first time, set their role to owner:

```sql
UPDATE profiles
SET role = 'owner'
WHERE id = 'USER_UUID';
```

To promote another user to admin:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'USER_UUID';
```

Admin access is available from the shared login page and Password and security page. An authenticated member can enter `ADMIN_ACCESS_KEY` to promote only their own profile to `admin`; existing `admin` and `owner` accounts can use the key to establish admin access. Configure a unique random value of at least 32 characters in `.env.local` and in your deployment's server-side environment; never expose it with a `NEXT_PUBLIC_` prefix.

Generate a key locally with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Set the generated value as `ADMIN_ACCESS_KEY` in `.env.local` and your host's server-side secrets. Keep `.env.example` blank and share the key only with administrators.

Signed-in members can also enter this key under **Password and security → Activate Admin**. The server verifies the key and promotes only the authenticated user's own profile to `admin`; the user ID and role are never accepted from the browser. The endpoint uses `SUPABASE_SERVICE_ROLE_KEY` on the server. It is not required in browser code.

## Free hosting with automatic deploys

For a personal, non-commercial site, the simplest workflow is GitHub connected to Vercel. Check the host's current free-plan terms before using it for a commercial project.

1. Create a GitHub repository. In VS Code, open Source Control, choose **Initialize Repository**, commit the project, then **Publish Branch** to GitHub. The `.gitignore` excludes `.env.local`; keep secrets out of commits.
2. In Vercel, choose **Add New Project**, import the GitHub repository, and deploy the `main` branch with the default Next.js settings.
3. In Vercel Project Settings → Environment Variables, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, and `ADMIN_ACCESS_KEY`. Set `NEXT_PUBLIC_SITE_URL` to the deployed production URL. `ADMIN_ACCESS_KEY` must be a random server-side secret of at least 32 characters.
4. In Supabase Auth → URL Configuration, set the Site URL to your production URL and add `https://<your-production-domain>/auth/callback` to the allowed redirect URLs. Keep the local callback URL for development.
5. Run `supabase/schema.sql`, `supabase/avatars.sql`, `supabase/assets.sql`, `supabase/wishlist.sql`, and `supabase/admin-promotion.sql` in the Supabase SQL Editor if the corresponding schema has not already been installed.
6. Redeploy after changing environment variables.

After connecting GitHub, every push to `main` automatically triggers a production deployment; pushes to other branches create previews. Saving a file in VS Code alone does not publish it. To publish an edit, commit and push it:

```bash
git add .
git commit -m "Describe the change"
git push
```

## Production readiness

The private `assets` bucket must remain private. The current `/api/assets/view` and `/api/assets/download` routes are authentication-checked placeholders; they do not yet return signed URLs or record completed downloads. Implement and test those flows before enabling real asset delivery to users.

The `/admin/upload` screen is currently a UI placeholder; its form does not yet upload files. The database insert policy and `supabase/assets.sql` Storage policies restrict asset records and asset objects to `admin` and `owner` roles when the SQL setup has been applied.

## Important security notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser
- Keep the `assets` bucket private; profile images use the separate public `avatars` bucket
- Validate MIME type, file extension, and size server-side
- Do not rely on client-side role checks for privileged actions
- Asset view/download API routes are currently authentication-checked placeholders; signed asset delivery is not implemented yet

## Database SQL

Review `supabase/schema.sql` for the database tables, indexes, RLS rules, and trigger logic. Existing projects can apply storage and access changes with `supabase/avatars.sql`, `supabase/assets.sql`, `supabase/wishlist.sql`, and `supabase/admin-promotion.sql`.

## Backend Documentation

See [docs/backend-setup.md](docs/backend-setup.md) for authentication flows, admin access-key setup, API route behavior, storage security, and SQL deployment instructions.

## Full file structure

- app/
- components/
- lib/
- supabase/
- docs/
- middleware.ts
- README.md
- .env.example

## Quality checklist

- Homepage loads
- Dark premium design works
- Asset pages render
- Admin and dashboard routes exist
- Storage is private
- Auth flows are configured in Supabase
- Production build succeeds with `npm run build`
