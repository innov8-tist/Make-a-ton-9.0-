# Brightloop - Subscription Management Platform

A full-stack subscription and billing management platform with integrated authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16
- Redis (for session storage)

### Backend Setup (API)
```bash
cd apps/api
npm install
npm run db:migrate
npm run dev
# Runs on http://localhost:4000
```

### Frontend Setup
```bash
cd apps/frontend
npm install
npm run dev
# Runs on http://localhost:5174
```

## 📚 Authentication Integration Documentation

**🎯 START HERE:** See [`AUTH_DOCUMENTATION_INDEX.md`](./AUTH_DOCUMENTATION_INDEX.md) for complete documentation guide.

### Quick Links
- 📋 **Overview**: [`INTEGRATION_SUMMARY.md`](./INTEGRATION_SUMMARY.md)
- ⚡ **Quick Reference**: [`AUTH_QUICK_REFERENCE.md`](./AUTH_QUICK_REFERENCE.md)
- 🔧 **Technical Guide**: [`AUTHENTICATION_INTEGRATION.md`](./AUTHENTICATION_INTEGRATION.md)
- ✅ **Testing Guide**: [`TEST_AUTH.md`](./TEST_AUTH.md)
- 🚀 **Next Steps**: [`NEXT_STEPS.md`](./NEXT_STEPS.md)
- 📊 **Architecture**: [`AUTH_FLOW_DIAGRAM.md`](./AUTH_FLOW_DIAGRAM.md)

## 🔐 Authentication

The platform includes a fully integrated authentication system with:
- ✅ Cookie-based session management
- ✅ Role-based access control (Admin, Staff, Customer)
- ✅ Secure password hashing
- ✅ Password reset flow
- ✅ Protected routes

**Test it:** Navigate to `http://localhost:5174/auth`

## 🏗️ Project Structure

```
make-a-ton/
├── apps/
│   ├── api/              # Backend (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── middleware/
│   │   │   └── lib/
│   │   └── prisma/       # Database schema
│   │
│   └── frontend/         # Frontend (React + TypeScript)
│       ├── src/
│       │   ├── components/
│       │   ├── routes/
│       │   ├── lib/
│       │   └── contexts/
│       └── ...
│
└── docs/                 # Documentation (*.md files in root)
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis + BullMQ
- **Email**: Resend
- **Security**: Helmet, CORS, scrypt password hashing

### Frontend
- **Framework**: React 19
- **Router**: TanStack Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Build**: Vite

## 📝 Environment Setup

### Backend (`.env`)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/brightloop
FRONTEND_URL=http://localhost:5174
SESSION_TTL_MIN=1440
COOKIE_SECURE=false
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000
```

## 🧪 Testing

See [`TEST_AUTH.md`](./TEST_AUTH.md) for comprehensive testing guide.

### Quick Test
```bash
# Test backend health
curl http://localhost:4000/api/v1/health

# Test signup
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"TestPass123!"}'
```

## 📦 Key Features

- **Subscription Management**: Plans, billing, invoices
- **Customer Portal**: Self-service account management  
- **Staff Dashboard**: Operational management
- **Admin Panel**: Full system control
- **Email Notifications**: Automated via queue system
- **Reporting**: Analytics and insights
- **Tax Management**: Configurable tax rules
- **Discount System**: Flexible discount codes

## 🔒 Security Features

- HttpOnly cookie-based sessions
- CORS protection
- Password requirements enforced
- Role-based access control
- Session expiration
- Protected API endpoints

## 📖 API Documentation

See [`API_TESTING.md`](./API_TESTING.md) for API endpoint testing.

## 🚧 Known Limitations

- No logout functionality yet (see [`NEXT_STEPS.md`](./NEXT_STEPS.md))
- No session persistence on refresh
- No protected route guards in frontend
- Password reset uses mock in development

## 🤝 Contributing

1. Read the documentation starting with [`AUTH_DOCUMENTATION_INDEX.md`](./AUTH_DOCUMENTATION_INDEX.md)
2. Check [`NEXT_STEPS.md`](./NEXT_STEPS.md) for tasks to implement
3. Follow the testing guide in [`TEST_AUTH.md`](./TEST_AUTH.md)

## 📞 Support

For authentication-related questions, refer to:
1. [`AUTH_QUICK_REFERENCE.md`](./AUTH_QUICK_REFERENCE.md) - Quick answers
2. [`AUTHENTICATION_INTEGRATION.md`](./AUTHENTICATION_INTEGRATION.md) - Detailed guide
3. [`TEST_AUTH.md`](./TEST_AUTH.md) - Troubleshooting

## ⚙️ Legacy Setup (Original Notes)

1. Install PostgreSQL 16 locally and run `createdb brightloop`.
2. Copy `.env.example` to `.env` and fix `DATABASE_URL`.
3. Run `npm install`.
4. Run `npm run db:migrate`.
5. Run `npm run dev`.

Mailpit is optional as a single binary; use SMTP on localhost:1025 and its UI on localhost:8025. No Docker is used.

---

**🎉 Authentication is fully integrated and ready to use!** Start with [`AUTH_DOCUMENTATION_INDEX.md`](./AUTH_DOCUMENTATION_INDEX.md) to get up to speed.
