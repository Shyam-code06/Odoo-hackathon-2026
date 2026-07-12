# TransitOps (Smart Transport Operations Platform) - Backend

TransitOps is a centralized, end-to-end transport operations backend platform designed to replace manual spreadsheets and logbooks. It digitizes assets, compliance, logs, and financial flows while enforcing business rules and computing operational metrics.

---

## 🛠️ Tech Stack & Requirements
*   **Node.js**: v18+ / v20+ / v22+
*   **Express**: Web application framework
*   **Prisma v7**: Next-generation database connection and schema ORM
*   **PostgreSQL**: Target database service
*   **pg / @prisma/adapter-pg**: Direct node-postgres driver adapter (to match Prisma v7 guidelines)

---

## 📂 Project Structure (MVC Model)

```
odoo-hackathon-2026/
├── client/                     # Frontend Vite client folder
├── server/                     # Backend Express server folder
│   ├── generated/              # Compiled Prisma client
│   ├── prisma/                 # Database migrations and schema
│   │   ├── migrations/
│   │   ├── schema.prisma       # Database design (Postgres tables)
│   │   └── seed.js             # Initial database seeding script
│   ├── src/                    # Backend Source Code
│   │   ├── config/             # DB Client and env loader configs
│   │   ├── controllers/        # Express handlers (Route requests)
│   │   ├── middlewares/        # Authentication, Role checks, Error handling
│   │   ├── routes/             # Path routers mounting controllers
│   │   └── services/           # Business logic & query operations
│   ├── postman_test_cases.md   # Setup documentation for testing
│   ├── package.json            # Scripts & dependencies
│   └── server.js               # Main server entry point
├── .env                        # Central environment configuration file (Root)
└── README.md                   # Setup guide
```

---

## 🚀 Setup & Execution Guide

Follow these steps to get your local server up and running:

### Step 1: Configure Environment Variables
Create or open the `.env` file in the root directory (`odoo-hackathon-2026/.env`) and add your connection string. 

Example:
```env
DATABASE_URL="postgresql://postgres:postgres09HM@localhost:5432/odoo_hackathon?schema=public"
JWT_SECRET="your_fallback_secret_key"
PORT=3000
```

---

### Step 2: Install Backend Dependencies
Navigate to the `server` directory and install the packages:
```bash
cd server
npm install
```

---

### Step 3: Compile the Database Schema
Generate the client using the schema rules:
```bash
npx prisma generate
```

---

### Step 4: Seed the Database
Populate your database with the default administrative accounts, vehicles, and drivers:
```bash
npm run seed
```

---

### Step 5: Start the Express API Server
Launch your API server:
```bash
npm start
```
The server will start running on **`http://localhost:3000`**.

---

## 🔒 Implemented Roles & Access Control (RBAC)

Authentication is stateless via JWT. Four administrative roles are supported:

| Role | Operational Scope / Access Permitted |
| :--- | :--- |
| **FLEET_MANAGER** | Full access to CRUD vehicles, drivers, expenses, trips, and maintenance logs. |
| **DISPATCHER** | Manage active trips, assign vehicles, draft operations, and monitor lifecycle. |
| **SAFETY_OFFICER** | Manage driver compliance profiles and track license expiry warnings. |
| **FINANCIAL_ANALYST** | View charts, operating cost aggregates, fuel consumption, and ROI metrics. |

> [!WARNING]
> Accounts with the **`DRIVER`** role are blocked from logging in. Drivers are represented only as database entities.

---

## 🚛 Core Business Rules Enforced

*   **Cargo Limit check**: Draft trip cargo weight cannot exceed the vehicle's `maxLoadCapacity`.
*   **Driver Compliance checks**: Cannot dispatch trips if the driver is `SUSPENDED` or their license is expired.
*   **Asset locks**: Double-booking is blocked. Drivers or vehicles with status `ON_TRIP` cannot be dispatched to other trips.
*   **Maintenance Isolation**: Pushing a vehicle to maintenance (`POST /api/maintenance`) immediately sets its status to `IN_SHOP` to hide it from the dispatcher pool.
*   **Metrics Engine**: Automatically logs refueling and maintenance actions as general company expenses to compute real-time Vehicle ROI.

---

## 🧪 Testing endpoints with Postman
Detailed request payloads, headers, URL routes, and expected HTTP statuses are documented in the [postman_test_cases.md](file:///c:/Users/HP/Odoo-hackathon-2026/server/postman_test_cases.md) file inside the `server/` directory.