# Blackboard Nova

Blackboard Nova is a full stack assignment management platform for universities with role-based access, assignment submission workflows, academic integrity analysis, grading, analytics, S3-style storage, SendGrid bulk email, and deployment-ready frontend/backend separation.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Recharts
- Backend: Node.js, Express, JWT, Multer, BullMQ
- Database: PostgreSQL with Prisma ORM
- Storage: Amazon S3 compatible object storage
- Email: SendGrid

## Structure

```text
frontend/
backend/
render.yaml
```

## Backend setup

1. Copy [backend/.env.example](/c:/Users/Shermack/Desktop/Blackboard/backend/.env.example) to `backend/.env`.
2. Install dependencies in `backend/` with `npm install`.
3. Run `npm run prisma:generate`.
4. Run Prisma migrations against PostgreSQL.
5. Start Redis for BullMQ workers.
6. Start the API with `npm run dev`.

## Frontend setup

1. Copy [frontend/.env.example](/c:/Users/Shermack/Desktop/Blackboard/frontend/.env.example) to `frontend/.env`.
2. Install dependencies in `frontend/` with `npm install`.
3. Run `npm run dev`.

## Core capabilities

- JWT authentication with `STUDENT`, `LECTURER`, and `ADMIN` roles
- Lecturer course creation and code-based student enrollment
- Assignment creation, deadline tracking, and secure uploads for PDF, DOCX, and ZIP
- AI detection heuristics, cosine similarity scoring, and suspicious submission flagging
- Lecturer grading table with publish flow and Excel/PDF export generation
- Bulk lecturer email campaigns for targeted student groups
- Animated student, lecturer, and admin-friendly dashboards
- Analytics for grade distribution, class average, and submission rates
- Deployment scaffolding for Vercel, Render, PostgreSQL, and Redis

## Notes

- The AI detection module is intentionally heuristic-based and should be replaced with a dedicated detector before production use.
- The S3 layer is compatible with AWS S3 and S3-style providers such as Cloudflare R2 or MinIO.
- The BullMQ worker starts inside the backend process for simplicity. For production scale, split it into a dedicated worker service.
