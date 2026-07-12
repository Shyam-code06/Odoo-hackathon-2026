# TransitOps – Smart Transport Operations Platform


TransitOps is a full-stack, enterprise-grade Fleet and Transport Management System built to streamline freight logistics. The platform digitizes transport operations by centralizing assets, compliance records, fuel logs, operational expenses, and lifecycle trip dispatching while enforcing strict business rules through Role-Based Access Control (RBAC).

---

## 📌 Problem Statement

In modern supply chain management, many logistics organizations still rely on manual spreadsheets, paper logs, and disconnected messaging apps. This leads to:
*   **Asset Underutilization**: Low visibility on which vehicles are idle, active, or in workshops.
*   **Compliance Failure**: Dispatched drivers operating with expired licenses, posing safety and legal risks.
*   **Inefficient Maintenance**: Missed routine servicing leading to high breakdown costs.
*   **Uncontrolled Leakage**: Loose expense validation and unverified fuel logs causing financial losses.
*   **Manual Overhead**: Inability to track trip statuses in real-time or aggregate metrics for business audits.

TransitOps solves these inefficiencies by providing a centralized command center that automates fleet operations, enforces strict business compliance, and generates live telemetry reports.

---

## ⚡ Key Features

*   🛡️ **JWT Authentication**: Secure user login sessions using stateless token tracking.
*   🔒 **Role-Based Access Control (RBAC)**: Fine-grained access control across 4 roles (`FLEET_MANAGER`, `DISPATCHER`, `SAFETY_OFFICER`, and `FINANCIAL_ANALYST`).
*   🚚 **Vehicle Management**: Digitized asset registry tracking registration numbers, odometers, capacities, and active states.
*   👤 **Driver Management**: Complete operator directory detailing licenses, safety score indexes, and license validity constraints.
*   🛣️ **Trip Dispatch Wizard**: Interactive multi-step stepper to set routes, assign verified vehicles and drivers, and track cargo payloads.
*   ⛽ **Fuel Log Registry**: Log fuel refills mapped to vehicles and specific trips to monitor cost-efficiency.
*   💸 **Expense Auditing**: Categorize highway tolls, parking costs, driver allowances, and other logistics expenses.
*   🔧 **Maintenance Workflows**: Log maintenance requests to put vehicles into workshop states and automatically record costs.
*   📊 **KPI Dashboard**: Interactive cards reporting fleet utilization, monthly expenses, maintenance trends, and active trips.
*   📈 **Reports & Exporting**: Generate operational cost analyses and export data tables as clean CSV files.
*   🚦 **Automatic State Transitions**: Trip dispatching, completion, and cancellation dynamically adjust vehicle and driver availability indicators.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite | Dynamic, modern single page application |
| **Styling** | Vanilla CSS, Tailwind CSS | Curated dark-mode theme and clean design |
| **Backend** | Node.js, Express.js | High-performance RESTful API Gateway |
| **Database** | PostgreSQL | Relational database engine |
| **ORM** | Prisma v7 | Safe querying adapter with pg connection pool |
| **Authentication** | JWT, bcryptjs | Password hashing and session protection |
| **Version Control** | Git, GitHub | Code tracking and collaborative deployment |

---

## 📂 Project Structure

```text
odoo-hackathon-2026/
├── client/                     # Frontend project folder (Vite + React)
│   ├── src/
│   │   ├── components/         # Reusable design components (Badges, Buttons)
│   │   ├── config/             # Base API url and environment options
│   │   ├── data/               # Local mock JSON fallback telemetry data
│   │   ├── pages/              # Module screens (Vehicles, Drivers, Trips)
│   │   ├── services/           # Axios service layer APIs (vehicleService.js)
│   │   └── utils/              # Export helpers and formatters
├── server/                     # Backend project folder (Express API server)
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema and models mapping
│   │   └── seed.js             # Realistic database seeder script
│   ├── src/
│   │   ├── config/             # DB client adapter pools and variables
│   │   ├── controllers/        # Request handlers (authController.js)
│   │   ├── middlewares/        # JWT verifiers and RBAC roles check
│   │   ├── routes/             # API routes definitions (tripRoutes.js)
│   │   └── services/           # Data transaction services (tripService.js)
│   ├── server.js               # Express application initializer
│   └── package.json            # Node configuration scripts
```

---

## 🗄️ Database Design

The database schema is constructed with the following core entities:
*   **User**: Admin dashboard users with role attributes (`FLEET_MANAGER`, `DISPATCHER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`, `DRIVER`).
*   **Vehicle**: Fleet assets tracking unique registration numbers, status enums, load limits, and mileage.
*   **Driver**: Professional operator profile tracking safety scores, CDL numbers, and license expiry states.
*   **Trip**: Connecting cargo payloads with assigned vehicles and drivers, managing lifecycles (`DRAFT`, `DISPATCHED`, `COMPLETED`, `CANCELLED`).
*   **MaintenanceLog**: Logs repairs and costs, altering vehicle dispatch availability.
*   **FuelLog**: Telemetry recording fuel refills to capture fuel efficiency metrics (km/L).
*   **Expense**: Operational costs classified by category enums.
*   **VehicleDocument**: Insurance policies, pollution certifications, and permit URLs.

---

## ⚖️ Core Business Rules

The backend service layer acts as a compliance engine by enforcing the following guidelines:
1.  **Unique Registrations**: The system rejects vehicles with duplicate registration plates and drivers with duplicate license keys.
2.  **Driver Expiration Lock**: A driver with an expired license cannot be assigned to any trip.
3.  **Payload Capacity Enforcer**: A trip dispatch fails if the cargo weight exceeds the assigned vehicle's load capacity.
4.  **Workshop Guard**: Vehicles marked as `IN_SHOP` under active maintenance cannot be dispatched.
5.  **Single Active Assignment**: Drivers already assigned to an `in_transit` (dispatched) trip are blocked from receiving new trip assignments.
6.  **State Machine Lifecycle Actions**:
    *   **Dispatching**: Sets the vehicle and driver status to `ON_TRIP`.
    *   **Completing**: Restores vehicle and driver availability (`AVAILABLE`) and updates the vehicle's odometer reading based on the trip's actual distance.
    *   **Cancelling**: Resets the vehicle and driver back to `AVAILABLE`.

---

## 🔑 Authentication & Authorization (RBAC)

*   **Secure Authentication**: Passwords are encrypted on signup/seed with `bcryptjs` using a cost factor of `10`.
*   **Role-Based Access (RBAC)**: Route middleware filters operations against the logged-in user's role payload:
    *   `FLEET_MANAGER`: Complete system administrative authorization.
    *   `DISPATCHER`: Can schedule and adjust trip lifecycles.
    *   `SAFETY_OFFICER`: Authorizes driver licensing audits.
    *   `FINANCIAL_ANALYST`: Audits operational cost analytics, fuel expenditures, and reports.
    *   `DRIVER`: Restricted from web console access.

---

## 📡 API Modules

| Module | Route | Method | Access Allowed | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login`<br>`/api/auth/register`<br>`/api/auth/me` | POST<br>POST<br>GET | Guest<br>Guest<br>Authenticated | Standard session management & verification |
| **Vehicles** | `/api/vehicles`<br>`/api/vehicles/:id` | GET, POST, PUT, DELETE | Managers, Officers | Manage fleet assets & audit mileage |
| **Drivers** | `/api/drivers`<br>`/api/drivers/:id` | GET, POST, PUT, DELETE | Managers, Officers | Maintain operator profiles & verify licensing |
| **Trips** | `/api/trips`<br>`/api/trips/:id`<br>`/api/trips/:id/dispatch`<br>`/api/trips/:id/complete`<br>`/api/trips/:id/cancel` | GET, POST, PUT, DELETE<br>PUT | Managers, Dispatchers | Control routes, assign drivers, and manage statuses |
| **Maintenance**| `/api/maintenance`<br>`/api/maintenance/:id/complete`| GET, POST, PUT | Managers, Officers | Workshop dispatch and repair logs |
| **Fuel** | `/api/fuel` | GET, POST, PUT, DELETE | Managers, Analysts | Log fuel transactions and liters |
| **Expenses** | `/api/expenses` | GET, POST, PUT, DELETE | Managers, Analysts | Audit operational cash flows |
| **Reports** | `/api/reports/roi`<br>`/api/reports/export/csv` | GET | Analysts, Managers | Compute asset performance and stream CSVs |

---

## 🚀 Installation & Local Setup

Follow these steps to run the stack locally:

### 1. Clone Project
```bash
git clone https://github.com/your-username/odoo-hackathon-2026.git
cd odoo-hackathon-2026
```

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/transitops?schema=public"
JWT_SECRET="your-jwt-secure-secret-key-phrase"
PORT=3000
```

### 3. Setup Backend Services
```bash
cd server
npm install

# Run database schema migrations
npx prisma db push

# Generate Prisma compiler engine client
npx prisma generate

# Populate database with realistic enterprise data
npm run seed

# Start the Express server
npm start
```

### 4. Setup Frontend Client
```bash
cd ../client
npm install

# Start Vite hot-reload server
npm run dev
```
Open **`http://localhost:5173`** to access the web application!

---

## 📸 Screenshots

### 1. Unified KPIs Dashboard
![KPIs Dashboard](/C:/Users/HP/.gemini/antigravity-ide/brain/093e3f55-6096-4935-9239-55e5016ae2c0/media__1783844828616.png)

### 2. Live Fleet Telemetry Views
![Fleet Telemetry Views](/C:/Users/HP/.gemini/antigravity-ide/brain/093e3f55-6096-4935-9239-55e5016ae2c0/media__1783845414444.png)

---

## 👥 Hackathon Team
*   **Backend Engineering**: Shyam / https://github.com/Shyam-code06
*   **Frontend Engineering**: Dhruvi Patel / https://github.com/Dhruvi2006-source
*   **Backend Engineering**: Himaghna / https://github.com/HDev-noi-09

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.