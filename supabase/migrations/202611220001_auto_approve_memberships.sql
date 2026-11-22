-- Approve existing pending memberships and automatically approve new registrations.
-- Keep the stored 'accepted' value compatible with existing cards and lookups.
BEGIN;

ALTER TABLE public.submissions
  ALTER COLUMN membership_status SET DEFAULT 'accepted';

UPDATE public.submissions
SET membership_status = 'accepted'
WHERE type = 'membership' AND membership_status = 'pending';

NOTIFY pgrst, 'reload schema';
COMMIT;
