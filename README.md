# Brightloop API scaffold

1. Install PostgreSQL 16 locally and run `createdb brightloop`.
2. Copy `.env.example` to `.env` and fix `DATABASE_URL`.
3. Run `npm install`.
4. Run `npm run db:migrate`.
5. Run `npm run dev`.

Mailpit is optional as a single binary; use SMTP on localhost:1025 and its UI on localhost:8025. No Docker is used.
