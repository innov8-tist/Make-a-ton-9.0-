# API Testing Guide

## Base URL
```
http://localhost:4000/api/v1
```

## Setup

### 1. Start Database
```bash
cd apps/api
docker-compose up -d
```

### 2. Run Migrations
```bash
npx prisma migrate dev
```

### 3. Seed Database (Creates Admin User)
```bash
npx prisma db seed
```

### 4. Start Server
```bash
npm run dev
```

Server will run on port 4000 by default.

---

## Authentication Endpoints

### 1. Customer Signup
Create a new customer account.

**Endpoint:** `POST /api/auth/signup`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Success Response (201):**
```json
{
  "data": {
    "user": {
      "id": 2,
      "email": "john@example.com",
      "name": "John Doe",
      "role": "CUSTOMER"
    }
  }
}
```

**Error Response (409) - Email Exists:**
```json
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "An account with this email already exists",
  "errors": {
    "email": ["Email is already registered"]
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": {
    "password": ["Password must contain an uppercase letter"]
  }
}
```

---

### 2. Login (All User Types)
Login as ADMIN, STAFF, or CUSTOMER.

**Endpoint:** `POST /api/auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body (Admin):**
```json
{
  "email": "admin@brightloop.com",
  "password": "Admin@123"
}
```

**Request Body (Customer):**
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Request Body (Staff):**
```json
{
  "email": "jane@brightloop.com",
  "password": "StaffPass@123"
}
```

**Success Response (200):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "admin@brightloop.com",
      "name": "Admin User",
      "role": "ADMIN"
    }
  }
}
```

**Note:** Sets `session` cookie automatically for subsequent requests.

**Error Response (401):**
```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

---

### 3. Create Staff Member (Admin Only)
Admin creates a new staff user.

**Endpoint:** `POST /api/auth/staff`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Cookie": "session=<your-admin-session-token>"
}
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@brightloop.com",
  "password": "StaffPass@123",
  "role": "STAFF"
}
```

**Success Response (201):**
```json
{
  "data": {
    "user": {
      "id": 3,
      "email": "jane@brightloop.com",
      "name": "Jane Smith",
      "role": "STAFF"
    }
  }
}
```

**Error Response (401) - Not Authenticated:**
```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

**Error Response (403) - Not Admin:**
```json
{
  "code": "FORBIDDEN",
  "message": "Insufficient permissions"
}
```

---

### 4. Forgot Password
Request password reset token.

**Endpoint:** `POST /api/auth/forgot-password`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200) - Development Mode:**
```json
{
  "message": "Password reset email sent",
  "data": {
    "token": "a1b2c3d4e5f6...",
    "email": "john@example.com"
  }
}
```

**Success Response (200) - Production Mode:**
```json
{
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

**Note:** In development, the token is returned in the response for testing. In production, it's only sent via email.

---

### 5. Reset Password
Reset password using token from forgot password.

**Endpoint:** `POST /api/auth/reset-password`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewSecurePass@456"
}
```

**Success Response (200):**
```json
{
  "message": "Password has been reset successfully"
}
```

**Error Response (400):**
```json
{
  "code": "INVALID_TOKEN",
  "message": "Invalid or expired reset token"
}
```

**Note:** All existing sessions are invalidated after password reset.

---

## Testing Scenarios

### Scenario 1: Complete Customer Flow

#### Step 1: Customer Signs Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "Customer@123"
  }'
```

#### Step 2: Customer Logs In
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "alice@example.com",
    "password": "Customer@123"
  }'
```

#### Step 3: Customer Accesses Protected Resource
```bash
curl -X GET http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

### Scenario 2: Admin Creates Staff

#### Step 1: Admin Logs In
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{
    "email": "admin@brightloop.com",
    "password": "Admin@123"
  }'
```

#### Step 2: Admin Creates Staff Member
```bash
curl -X POST http://localhost:3000/api/auth/staff \
  -H "Content-Type: application/json" \
  -b admin-cookies.txt \
  -d '{
    "name": "Bob Williams",
    "email": "bob@brightloop.com",
    "password": "StaffSecure@789",
    "role": "STAFF"
  }'
```

#### Step 3: Staff Member Logs In
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c staff-cookies.txt \
  -d '{
    "email": "bob@brightloop.com",
    "password": "StaffSecure@789"
  }'
```

---

### Scenario 3: Password Reset Flow

#### Step 1: Request Password Reset
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com"
  }'
```

**Save the token from the response.**

#### Step 2: Reset Password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE",
    "password": "NewPassword@456"
  }'
```

#### Step 3: Login with New Password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "NewPassword@456"
  }'
```

---

## Test Data Collection

### Valid Test Users

#### Admin User (Seeded)
```json
{
  "email": "admin@brightloop.com",
  "password": "Admin@123",
  "role": "ADMIN"
}
```

#### Customer User Examples
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "Customer@123"
}
```

```json
{
  "name": "Charlie Brown",
  "email": "charlie@example.com",
  "password": "SecurePass@999"
}
```

#### Staff User Examples (Created by Admin)
```json
{
  "name": "Bob Williams",
  "email": "bob@brightloop.com",
  "password": "StaffSecure@789",
  "role": "STAFF"
}
```

```json
{
  "name": "Diana Prince",
  "email": "diana@brightloop.com",
  "password": "StaffPass@456",
  "role": "STAFF"
}
```

---

## Password Requirements

All passwords must meet these criteria:
- ✅ More than 8 characters (minimum 9)
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one special character (!@#$%^&*...)

### Valid Password Examples
- `SecurePass@123`
- `Admin@123`
- `StaffPass@456`
- `Customer!2024`
- `MyP@ssw0rd`

### Invalid Password Examples
- `password` - No uppercase, no special char
- `PASSWORD` - No lowercase, no special char
- `Pass@123` - Only 8 characters (needs 9+)
- `Password123` - No special character
- `Password@` - No numbers (technically valid, but weak)

---

## Postman Collection

You can import this JSON into Postman:

```json
{
  "info": {
    "name": "Brightloop Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Customer Signup",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Alice Johnson\",\n  \"email\": \"alice@example.com\",\n  \"password\": \"Customer@123\"\n}"
        },
        "url": {"raw": "{{baseUrl}}/auth/signup"}
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"admin@brightloop.com\",\n  \"password\": \"Admin@123\"\n}"
        },
        "url": {"raw": "{{baseUrl}}/auth/login"}
      }
    },
    {
      "name": "Create Staff (Admin)",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Bob Williams\",\n  \"email\": \"bob@brightloop.com\",\n  \"password\": \"StaffSecure@789\",\n  \"role\": \"STAFF\"\n}"
        },
        "url": {"raw": "{{baseUrl}}/auth/staff"}
      }
    },
    {
      "name": "Forgot Password",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"alice@example.com\"\n}"
        },
        "url": {"raw": "{{baseUrl}}/auth/forgot-password"}
      }
    },
    {
      "name": "Reset Password",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"token\": \"YOUR_TOKEN_HERE\",\n  \"password\": \"NewPassword@456\"\n}"
        },
        "url": {"raw": "{{baseUrl}}/auth/reset-password"}
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    }
  ]
}
```

---

## Common HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful request |
| 201 | Created | Successfully created user |
| 400 | Bad Request | Validation error or invalid data |
| 401 | Unauthorized | Not logged in or invalid credentials |
| 403 | Forbidden | Logged in but insufficient permissions |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Something went wrong on the server |

---

## Troubleshooting

### "Email already exists" error
- Use a different email address
- Or check if user already exists in database

### "Authentication required" error
- Make sure you're logged in
- Check if session cookie is being sent
- Session might have expired

### "Insufficient permissions" error
- Make sure you're using admin account for staff creation
- Check user role in login response

### "Invalid credentials" error
- Check email and password
- Verify password meets requirements
- Ensure user account is active

### Session not persisting
- Use `-c cookies.txt` to save cookies
- Use `-b cookies.txt` to send cookies
- Or use Postman which handles cookies automatically
