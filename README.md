# BoardApp

A simple React + .NET in-memory project and task manager.

## Features
- Create projects
- Create tasks
- Assign tasks to users
- No database required
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

## Tech Stack
- Backend: ASP.NET Core 10.0
- Frontend: React 18 + react-scripts
- Data storage: in-memory only
