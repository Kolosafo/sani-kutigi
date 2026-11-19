-- Run after 202611190001_digital_literacy_registrations.sql, before deploying
-- registration choices for all eight Niger South local government areas.
BEGIN;

ALTER TABLE public.digital_literacy_registrations
  DROP CONSTRAINT IF EXISTS digital_literacy_registrations_lga_check;

ALTER TABLE public.digital_literacy_registrations
  ADD CONSTRAINT digital_literacy_registrations_lga_check
  CHECK (lga IN ('Agaie', 'Bida', 'Edati', 'Gbako', 'Katcha', 'Lapai', 'Lavun', 'Mokwa'));

COMMIT;
