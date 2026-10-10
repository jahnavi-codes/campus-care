# CampusCare - Campus Complaint Management (MERN)

Students submit complaints and track them until they are resolved. Admins review every complaint, update its status with a remark, and manage categories and locations.

## Tech stack
- MongoDB + Mongoose (users, complaints, categories, locations)
- Node.js + Express REST API with JWT authentication and role-based access
- React (Vite) frontend with React Router

## Run it locally

Requirements: Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. install dependencies
npm run install-all

# 2. configure the server (a default .env is already included)
#    server/.env  ->  MONGO_URI, JWT_SECRET, PORT

# 3. load demo data (admin, student, categories, locations, sample complaints)
npm run seed

# 4. start the API (http://localhost:5000)
npm run server

# 5. in a second terminal, start the UI (http://localhost:5173)
npm run client
```

Demo logins
- Student: student@campus.edu / student123
- Admin: admin@campus.edu / admin123

## Features
| Area | What it does |
|------|--------------|
| Auth | Register (students), log in, JWT sessions, passwords hashed with bcrypt |
| Roles | `student` sees and edits only their own complaints; `admin` sees all and manages everything |
| Complaints | Create, view, edit (students while Pending), delete, search, filter by status/category/location |
| Status tracking | Pending, In Progress, Resolved, Rejected, with a timeline of remarks |
| Admin tools | Update status with remark, CRUD for categories and locations (blocked if in use) |
| Dashboard | Counts by status, complaints by category, latest complaints |

## REST API
All routes except register and login need `Authorization: Bearer <token>`.

| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | public (creates a student) |
| POST | /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/complaints?status=&category=&location=&q= | student (own) / admin (all) |
| POST | /api/complaints | logged in |
| GET | /api/complaints/:id | owner / admin |
| PUT | /api/complaints/:id | owner while Pending / admin |
| PATCH | /api/complaints/:id/status | admin |
| DELETE | /api/complaints/:id | owner while Pending / admin |
| GET | /api/categories, /api/locations | logged in |
| POST / PUT / DELETE | /api/categories, /api/locations | admin |
| GET | /api/stats | logged in |

## Data model
- **User**: name, email, password (hashed), rollNo, department, role
- **Category** and **Location**: name, description
- **Complaint**: title, description, student, category, location, priority, status, history[] (status, remark, by, at)

## Folder structure
```
campuscare/
  server/   config, models, middleware, routes, seed.js, server.js
  client/   src/pages, App.jsx, AuthContext.jsx, api.js, styles.css
```
