# Employee Leave Management System

A modern, full-stack web application for managing employees, departments and leave requests.
Built with **ASP.NET Core (.NET 9) Web API**, **React + Vite** and **SQL Server**.

![Dashboard](System%20Presentation/screenshots/02_dashboard.png)

## Features

- **Role-based access** — three roles (Admin, HR, Employee), each with its own permissions on both the frontend routes and the API endpoints.
- **Leave workflow** — employees apply for leave; HR/Admin review, approve or reject with full status tracking (Pending / Approved / Rejected).
- **Employee management** — full employee records linked to portal login accounts.
- **Configurable setup** — departments and leave types (annual, sick, casual, unpaid...) are managed inside the app, no code changes needed.
- **Real-time dashboard** — live counters for users, departments, employees, leave types and pending requests.
- **Premium UI** — clean, high-definition design with a dark sidebar, glassmorphism navbar and fully responsive layout (desktop to mobile).
- **Consistent API** — every response uses the same `{ success, message, data }` shape, with global exception handling middleware.

## Project Structure

```
FinalProject/
├── Backend/                  # ASP.NET Core Web API (.NET 9)
│   └── LeaveManagement.API/
│       ├── Controllers/      # Auth, Users, Employees, Departments, LeaveTypes, LeaveRequests
│       ├── Data/             # ADO.NET helpers (SQL access)
│       ├── DTOs/             # Request/response models
│       ├── Auth/             # Cookie + header authentication handler
│       ├── Middleware/       # Global exception handling
│       └── Constants/        # Roles and policy names
├── Frontend/                 # React + Vite single-page app
│   └── src/
│       ├── api/              # Axios API clients
│       ├── components/       # Layout + reusable UI components
│       ├── pages/            # Login, Dashboard, CRUD pages
│       └── styles/           # Global design system (app.css)
├── Database/
│   └── LeaveManagementDB.sql # Full database script (tables + sample data)
└── System Presentation/      # PowerPoint deck + UI screenshots
```

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or newer)
- SQL Server (with Windows Authentication)

### 1. Set up the database

Open `Database/LeaveManagementDB.sql` in SQL Server Management Studio and run the whole script.
It creates the `LeaveManagement` database with all tables and sample data.

### 2. Run the backend

Update the connection string in `Backend/LeaveManagement.API/appsettings.json` to point to your SQL Server instance:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=LeaveManagement;Integrated Security=True;TrustServerCertificate=True;"
}
```

Then start the API:

```bash
cd Backend/LeaveManagement.API
dotnet run
```

The API runs at `http://localhost:5000` (check it at `http://localhost:5000/api/status`).

### 3. Run the frontend

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Default logins (from the sample data)

| Role     | Username   | Password     |
|----------|------------|--------------|
| Admin    | `admin`    | `Admin@123`  |
| HR       | `hr_manager` | `HR@123`   |
| Employee | `john_doe` | `Employee@123` |

## API Overview

All endpoints return `{ success, message, data }`. Authentication uses an HTTP-only session
cookie set by `POST /api/login` (in development you can also send an `X-User-Id` header, e.g. `X-User-Id: 1`).

| Endpoint | Methods | Access |
|----------|---------|--------|
| `/api/login`, `/api/logout` | POST | Public / All roles |
| `/api/me` | GET | All roles |
| `/api/change-password` | POST | All roles |
| `/api/Users` | GET, POST, PUT, DELETE | Admin only |
| `/api/Departments` | GET, POST, PUT, DELETE | Admin, HR |
| `/api/Employees` | GET, POST, PUT, DELETE | Admin, HR (`GET /me` and `GET /{id}` for all roles) |
| `/api/LeaveTypes` | GET (all roles), POST, PUT, DELETE (Admin, HR) | Mixed |
| `/api/LeaveRequests` | GET, POST, PUT, DELETE | All roles |
| `/api/status` | GET | Public health check |

## Roles & Permissions

| Capability | Admin | HR | Employee |
|------------|:-----:|:--:|:--------:|
| Manage users (portal accounts) | ✅ | ❌ | ❌ |
| Manage departments & employees | ✅ | ✅ | ❌ |
| Manage leave types | ✅ | ✅ | ❌ |
| Review / approve leave requests | ✅ | ✅ | ❌ |
| Apply for and track own leave | ✅ | ✅ | ✅ |

## Screenshots

More screenshots are available in [`System Presentation/screenshots`](System%20Presentation/screenshots),
and a full presentation deck is in [`System Presentation`](System%20Presentation).

| Login | Leave Requests |
|-------|----------------|
| ![Login](System%20Presentation/screenshots/01_login.png) | ![Leave Requests](System%20Presentation/screenshots/05_leave_requests.png) |

## Tech Stack

- **Backend:** ASP.NET Core Web API (.NET 9), ADO.NET (`Microsoft.Data.SqlClient`), cookie-based session authentication, policy-based authorization
- **Frontend:** React 19, Vite, React Router, Axios, React Bootstrap, React Icons
- **Database:** SQL Server (normalized schema with foreign keys)
