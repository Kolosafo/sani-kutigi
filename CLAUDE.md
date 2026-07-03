## Tech Stack
- Django REST Framework + PostgreSQL
- React Native frontend (separate repo)
- Smile ID for KYC (SmartSelfie + Biometric)
- Gemini API for bank statement analysis

## Conventions
- Use class-based views with DRF generics, not function-based views
- All money fields use Decimal, never float
- Repayment schedule logic lives in `services.py`, not in models or views
- Use atomic transactions for any operation touching loan balances
- Follow existing naming: snake_case for fields, PascalCase for models

## Commands
- Run tests: `python manage.py test`
- Run server: `python manage.py runserver`
- Migrations: `python manage.py makemigrations && python manage.py migrate`

## Things to avoid
- Don't modify the credit decisioning schema weights without explicit confirmation
- Don't add new third-party KYC providers without discussion
- Don't touch the repayment schedule month-arithmetic logic — it's already 
  tuned and tested

## Current focus
Building out loan disbursement and repayment tracking endpoints.