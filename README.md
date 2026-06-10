# Private Real Estate Investment Platform (MVP)

## Stack
- Frontend: React + Vite + CSS
- Backend: Node.js + Express
- Database: SQLite (auto-created at startup with seed data)

## Folder Structure
- `backend/` Express API and SQLite initialization/seed
- `frontend/` React dashboard and management screens

## Run
### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend default: `http://localhost:4000`  
Frontend default: `http://localhost:5173`

## Included Modules
- Dashboard KPIs and alerts
- Investors CRUD
- Projects CRUD
- Investments with ownership auto-recalculation
- Expenses CRUD
- Stages CRUD
- Risks CRUD
- Documents metadata CRUD
- Scenarios CRUD
- Project and investor HTML report endpoints

## API routes
Implemented under `/api` according to requested specification.
