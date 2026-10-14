# Sani Kutigi Vanguard

Next.js application for membership registration, membership cards, inquiries, complaints, and suggestions.

## Local development

Install dependencies with `npm install`, then create `.env.local` at the project root:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-only-supabase-secret-key
```

Keep the secret key on the server. Configure the same variables on your deployment platform.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run lint` and `npm run build` to check changes.

## Photo watermarking

Members can open `/watermark` from **Watermark Photos** in the navigation or campaign gallery. Choose or drop one JPG, PNG or WebP photo (up to 20 MiB), preview the result, adjust the two logo sizes, and download PNG or JPG.

The editor places `public/overlay-watermark-main.png` at the top right and `public/overlay-watermark-shadow.png` in the center. The shadow asset already contains approximately 30% opacity, so it is drawn without further fading. Both assets use a shared artwork crop to remove transparent padding and preserve alignment. If the artwork bounds change, update `ARTWORK` in `lib/watermark.ts`.

Photos are processed locally using browser canvas; they are not uploaded or stored. Original proportions are preserved. Large photos are reduced to a maximum 4096-pixel edge and approximately 12 megapixels for reliable export on phones; photos over 64 megapixels are rejected. The preview displays the download dimensions. PNG preserves transparency; JPG uses a white background for transparent areas.

## Supabase setup

For a **new project**, run [supabase/schema.sql](supabase/schema.sql) in the Supabase dashboard SQL Editor, then run [supabase/migrations/202610110001_membership_registration_details.sql](supabase/migrations/202610110001_membership_registration_details.sql).

For an **existing project**, run only [the membership registration migration](supabase/migrations/202610110001_membership_registration_details.sql) in the SQL Editor before deploying the updated application. The migration runs in a transaction, preserves existing submissions, and can be rerun without changing issued registration numbers. It adds:

- `voter_id`: an optional voter's identification number (VIN), saved as text.
- `passport_photo_path`: the private storage path for the member's passport photograph. New registrations require a JPEG or PNG photograph up to 2 MiB; existing members retain their records without needing a photograph.
- `registration_number`: a positive, unique serial for memberships. Existing memberships receive numbers in registration-date order, with the submission ID resolving identical timestamps.
- A private `membership-passports` Storage bucket restricted to JPEG/PNG files up to 2 MiB.

The database assigns serial numbers using a private, locked counter in the same transaction as the registration. Failed inserts and non-membership submissions do not consume numbers. Existing numbers stay stable when member details are updated; deleting a member does not recycle their number. The application displays serials as `SKV-2027-000001`, `SKV-2027-000002`, and so on.

The submissions table and counter use row-level security. The migration creates no public database or Storage policies, and restricts the counter's function to the server role. Uploads and card retrieval use the application's server routes.

The migration has to be run in Supabase separately; configuring the application environment variables does not update the database schema.
