# Ad Agency Full Stack Assessment

## Tech Stack
- Frontend: React 18, Tailwind CSS, Recharts, jsPDF
- Backend: Node.js, Express, PostgreSQL, JWT
- AI Service: Google Gemini 1.5 Flash
- Realtime: Socket.io
- Infrastructure: Docker, docker-compose

## Quick Start with Docker
1. Clone the repo
2. Copy env files:
   cp backend/.env.example backend/.env
   cp ai-service/.env.example ai-service/.env
   cp notifications/.env.example notifications/.env
3. Add your Gemini API key to ai-service/.env
4. Run: docker-compose up --build
5. Open: http://localhost:5173

## Manual Setup
1. psql -U postgres -c "CREATE DATABASE ad_agency_db;"
2. psql -U postgres -d ad_agency_db -f database/schema.sql
3. cd database && node seed-user.js
4. cd backend && npm install && node src/server.js
5. cd ai-service && npm install && node src/server.js
6. cd notifications && npm install && node src/server.js
7. cd frontend && npm install && npm run dev

## Login Credentials
Email: admin@agency.com
Password: admin123

## API
Import docs/postman-collection.json into Postman
Base URL: http://localhost:3001

## Assessment Tasks Completed
- Task 1.1: Campaign Dashboard with KPI cards,
  line chart, sortable table, dark mode
- Task 1.2: AI Creative Brief Builder with 
  4-step form and PDF export
- Task 2.1: REST API with JWT, rate limiting,
  soft delete, PostgreSQL
- Task 2.2: AI Microservice with Gemini,
  SSE streaming, Docker
- Task 2.3: WebSocket notifications with
  alert rule engine
- Section 3: docs/section3-speed-tasks.md