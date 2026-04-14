# BoardApp

A simple React + .NET project and task manager.

## Features
- Create projects
- Create tasks
- Assign tasks to users
- PostgreSQL database with Flyway migrations
- No authentication or authorization

## Run the backend

```bash
cd backend
dotnet run --project src/BoardApp.Api/BoardApp.Api.csproj
```

The backend listens on `http://localhost:5001`.

## Run the frontend

```bash
cd frontend
npm install
npm start
```

Then open `http://localhost:3000`.

## Run with Docker

Ensure Docker and Docker Compose are installed.

```bash
docker-compose up --build
```

This will start:
- PostgreSQL on `localhost:5432`
- Flyway migrations (auto-applied from `backend/flyway/sql`)
- Backend on `http://localhost:8080`
- Frontend on `http://localhost:3000`

If you change migration files, recreate the stack for a clean run:

```bash
docker-compose down -v
docker-compose up --build
```

## Tech Stack
- Backend: ASP.NET Core 10.0
- Frontend: React 18 + react-scripts
- Data storage: PostgreSQL + Flyway migrations
