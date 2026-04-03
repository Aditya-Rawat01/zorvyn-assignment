# Zorvyn Assignment - Finance Backend

Backend system for managing financial records with role-based access control and dashboard analytics.

---
## Quick Test Flow

1. Run `npm run seed` and setup postman
2. Login using admin credentials
3. Copy token
4. Create a user
5. Create records
6. View dashboard
## Assumptions & Design Decisions

### Assumptions

- Analysts are allowed to view all records for analytical purposes but cannot modify them.
- Admins have full control over users and financial records.
- Viewers (USER role) are restricted to viewing only their own dashboard summaries.
- The system does not support public registration. Users are created by administrators.
- Single currency system is assumed.
- Authentication is handled via JWT without refresh tokens.

---

### Design Decisions

- **Modular Architecture**  
  Code is organized into modules (users, records, dashboard) for better scalability and maintainability.

- **Service Layer Separation**  
  Business logic is handled in services, keeping controllers clean and minimal.

- **RBAC via Middleware**  
  Role-based access control is implemented using middleware to ensure separation of concerns.

- **Soft Delete for Records**  
  Records are not permanently deleted to preserve historical data.

- **SQL-Based Aggregation**  
  Dashboard analytics use efficient database-level aggregation (Prisma + SQL).

- **Admin Bootstrap via Seed Script**  
  Since user creation is restricted to admins, a seed script is used to create a default admin and avoid the initial access deadlock.

---

## Features

- JWT-based authentication
- Role-based access control (USER, ANALYST, ADMIN)
- User management (admin only)
- Financial records CRUD
- Filtering (date, type, category, userId)
- Pagination support
- Soft delete for records
- Dashboard APIs:
  - Total income
  - Total expense
  - Net balance
  - Category-wise totals
  - Recent activity
  - Monthly trends

---

## Project Structure

```bash
src/
│
├── lib/
│   ├── prisma.ts
│   └── seed.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   └── rbac.middleware.ts
│
├── modules/
│   ├── dashboard/
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.routes.ts
│   │   └── dashboard.service.ts
│   │
│   ├── records/
│   │   ├── record.controller.ts
│   │   ├── record.routes.ts
│   │   ├── record.schema.ts
│   │   └── record.service.ts
│   │
│   └── users/
│       ├── user.controller.ts
│       ├── user.routes.ts
│       ├── user.schema.ts
│       └── user.service.ts
│
├── utils/
│   ├── jwt.ts
│   └── validate.zod.schema.ts
│
├── app.ts
└── server.ts
```

---

## Setup Instructions

1. Clone or unzip the repository

2. Install dependencies
   ```bash
   npm install
   ```
3. Copy environment variables

   ```bash
   cp .env.example .env
   ```

4. Set up PostgreSQL database (NeonDB or local)

5. Add your database connection string in `.env`

   ```bash
   DATABASE_URL=your_database_url
   ```

6. Apply migrations

   ```bash
   npx prisma migrate deploy
   ```

7. Generate Prisma client
   ```bash
   npx prisma generate
   ```
8. Seed default admin user (must)

   ```bash
   npm run seed
   ```

   This creates:
   - email: admin@example.com
   - password: admin123

9. Start the server  
   npm run dev

---

## Postman Collection
> All endpoints are available in the provided Postman collection for direct testing.
### Option 1: Open in Postman (Login Required)

You can access the hosted collection here:

[Open Postman Collection](https://.postman.co/workspace/My-Workspace~91052d1f-e197-4ff3-82d0-63510a793a90/collection/33501405-47d9d13c-019b-4061-a2ce-44567571bda9?action=share&creator=33501405)

> Note: This link may require you to log in to Postman.

---

### Option 2: Import Locally

The Postman collection is included in the repository:

[Postman Collection](./postman-collection.json)

#### Steps:

1. Open Postman
2. Click **Import**
3. Select the collection file
4. Configure the variables (baseURL, token, user-token, recordId, userId)
5. Start testing APIs
- `token` → used for ADMIN / ANALYST  
- `user-token` → used for USER role testing
---

### Default Admin Credentials

email: admin@example.com  
password: admin123

---

## API Documentation

### Base URL

- http://localhost:PORT (default: http://localhost:3000)

---

## Authentication

### Login

- POST /users/login

- Request Body:
  {
  "email": "admin@example.com",
  "password": "admin123"
  }

- Response:
  {
  "token": "jwt_token"
  }

---

## Users (Admin Only)

### Create User

- POST /users/create

- Headers:
  Authorization: Bearer <token>

- Request Body:
  {
  "email": "user@mail.com",
  "password": "12345",
  "role": "USER"
  }

---

### Update User Role

- POST /users/:userId/role

- Request Body:
  {
  "role": "ANALYST"
  }

---

### Update User Status (Soft Delete)

- POST /users/:userId/status

- Request Body:
  {
  "isActive": false
  }

---

### Delete User (Hard Delete)

- DELETE /users/:userId

---

## Records

### Create Record

- POST /records/create

- Request Body:
  {
  "amount": 108,
  "type": "EXPENSE",
  "description": "this is first transaction",
  "category": "first category"
  }

---

### Get Records

- GET /records

---

### Get Records (Pagination)

- GET /records?limit=5&page=2

---

### Get Records (Filtered)

- GET /records?type=INCOME&userId=<userId>&category=third category

---

### Update Record

- POST /records/:recordId

- Request Body:
  {
  "amount": 200
  }

---

### Delete Record

- DELETE /records/:recordId

---

## Dashboard

### Get Dashboard (All Data)

- GET /dashboard

Returns:

- Total income
- Total expense
- Net balance
- Category totals
- Recent activity
- Monthly trends

---

### Get Dashboard (By User)

- GET /dashboard?userId=`<userId>`

---

## Role-Based Access Summary

| Endpoint        | USER          | ANALYST | ADMIN |
| --------------- | ------------- | ------- | ----- |
| Login           | ✅            | ✅      | ✅    |
| Dashboard       | ✅ (own only) | ✅      | ✅    |
| Records (read)  | ❌            | ✅      | ✅    |
| Records (write) | ❌            | ❌      | ✅    |
| User management | ❌            | ❌      | ✅    |

---

## Notes

All protected routes require:

- Authorization: Bearer <token>

#### Default admin credentials:

- email: admin@example.com
- password: admin123

## Validation & Error Handling

- Input validation using Zod schemas
- Centralized validation middleware
- Consistent error responses

### Status Codes

- 400 → Bad Request (validation errors)
- 401 → Unauthorized
- 403 → Forbidden
- 404 → Not Found

---

## Tradeoff

The system does not support public registration. Users are created by administrators, which simplifies access control but reduces flexibility for open user onboarding.

---

## Future Improvements

- Refresh token support
- Rate limiting
- API documentation (Swagger)
- Unit & integration tests
- Multi-currency support
- Audit logs
