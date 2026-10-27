# Sani Kutigi Vanguard

Next.js application for community learning, membership registration, membership cards, inquiries, complaints, and suggestions.

## Local development

Install dependencies with `npm install`, then create `.env.local` at the project root:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-server-only-supabase-secret-key
```

Keep the secret key on the server. Configure the same variables on your deployment platform.

Social link previews use `https://sanikutigi.com` for their image URLs. Set `NEXT_PUBLIC_SITE_URL` to a different public origin when deploying the site elsewhere.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run lint` and `npm run build` to check changes.

## Free tech courses

The public `/courses` library is linked from the homepage, navigation and footer. Visitors can search skills and providers, combine coding/no-code and field filters, and open staged learning paths at `/courses/[slug]`. No membership or account on this site is needed.

Maintain the course catalog in `lib/skills.ts`. Each skill has a unique slug, learning outcomes, related skill slugs, and resources grouped into `Start here`, `Build depth`, and `Practice & prove it`. Counts and categories are derived from the data, and detail pages are generated during the build. Keep resource links current and distinguish free learning materials from paid certificates, exams, tools or optional services.

## Photo watermarking

The watermark tool is available only through the direct `/watermark` URL. It has no navigation, footer or gallery links, and asks search engines not to index it. This makes it unlisted; it does not require a password or restrict who can open a shared link.

Choose or drop up to 30 JPG, PNG or WebP photos (20 MiB per photo, 200 MiB combined). The standard watermark positions and sizes apply automatically to every photo. The optional adjustments panel starts collapsed, and any size changes apply to the whole batch. Photos retain their original proportions rather than being cropped to a common portrait shape.

Preview each photo using the file list or previous/next buttons. Download an individual photo, or download all photos together in one ZIP. JPG is the default for sharing; PNG is also available. The batch processes one image at a time, reports progress, supports cancellation, and lists unreadable photos that were skipped. Duplicate output filenames receive numeric suffixes so no photos are overwritten. ZIP output is limited to 256 MiB; use JPG or a smaller batch if needed.

The editor places `public/overlay-watermark-main.png` at the top right and `public/overlay-watermark-shadow.png` in the center. The shadow asset already contains approximately 30% opacity, so it is drawn without further fading. Each overlay's visible artwork bounds are detected independently and cached when it loads, so replacing either PNG with different dimensions or transparent padding preserves its alignment. The center watermark defaults to 30% of the photo's shorter edge to keep it compact in portrait and landscape photos; the top-right logo defaults to 22% of the photo's width.

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
