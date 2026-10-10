# Enterprise Service Desk

A full-stack service request management application built with ASP.NET Core Web API, Entity Framework Core, SQL Server LocalDB, and Angular.

The application demonstrates REST API development, database integration, frontend-to-backend communication, CRUD operations, input validation, and responsive dashboard design.

## Features

- **Dashboard** — Overview of service requests and priority distribution.
- **Request management** — Create, view, update, and delete service requests.
- **Search and filtering** — Find requests and filter by status.
- **Priority management** — Low, Medium, and High priorities.
- **Status tracking** — Open, In Progress, and Closed.
- **Input validation** — Validate request fields and enforce length limits.
- **REST API integration** — Angular communicates with the ASP.NET Core backend.
- **Automated test project** — xUnit and ASP.NET Core integration testing setup.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 22, TypeScript |
| Backend | ASP.NET Core Web API, .NET 8 |
| ORM | Entity Framework Core |
| Database | SQL Server LocalDB |
| API documentation | Swagger / OpenAPI |
| Testing | xUnit, ASP.NET Core integration testing, EF Core InMemory |
| Version control | Git |

## Architecture

```text
Angular Frontend
       |
       | HTTP / REST
       v
ASP.NET Core Web API
       |
       | Entity Framework Core
       v
SQL Server LocalDB
```

The Angular frontend uses a dedicated request service to communicate with the API. The backend handles request validation and database operations.

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/requests` | Retrieve all requests |
| GET | `/api/requests/{id}` | Retrieve a request by ID |
| POST | `/api/requests` | Create a request |
| PUT | `/api/requests/{id}` | Update a request |
| DELETE | `/api/requests/{id}` | Delete a request |

## Run Locally

### Prerequisites

- .NET 8 SDK
- Node.js and npm compatible with the installed Angular CLI
- SQL Server LocalDB
- Angular CLI dependencies installed through npm

### 1. Start the API

From the repository root:

```powershell
dotnet run --project .\EnterpriseServiceDesk.Api\EnterpriseServiceDesk.Api.csproj --urls http://localhost:5000
```

API base URL:

`http://localhost:5000`

Swagger UI:

`http://localhost:5000/swagger`

### 2. Start the Angular frontend

Open a second terminal:

```powershell
cd .\enterprise-service-desk-ui
npm install
npx ng serve
```

Open:

`http://localhost:4200`

### 3. Database configuration

The development configuration uses SQL Server LocalDB:

```text
Server=(localdb)\MSSQLLocalDB;Database=EnterpriseServiceDeskDb;Trusted_Connection=True;TrustServerCertificate=True;
```

Make sure LocalDB is installed and the database is initialized according to the API's configuration before running the application.

## Verification

The following have been manually verified during development:

- API and Angular production builds complete successfully.
- Creating a request in the UI persists it through the API.
- Request data can be retrieved from the API.
- Updating a request through the UI persists the changed priority.
- Deleting a request through the UI removes it from the API.

An automated test project is included. Automated test execution is currently blocked by a Windows Application Control policy and should be rerun in an approved environment before claiming that the test suite passes.

## Project Structure

```text
EnterpriseServiceDesk/
├── EnterpriseServiceDesk.Api/
│   ├── Program.cs
│   └── ...
├── EnterpriseServiceDesk.Tests/
│   └── ...
├── enterprise-service-desk-ui/
│   ├── src/
│   ├── angular.json
│   └── package.json
└── README.md
```

## Engineering Focus

This project demonstrates practical full-stack development skills, including:

- Designing RESTful endpoints.
- Separating frontend API communication from UI components.
- Implementing CRUD workflows.
- Integrating Entity Framework Core with a relational database.
- Applying input validation and HTTP status codes.
- Verifying end-to-end data flow between frontend and backend.

## Status

This is a portfolio demonstration project. The database configuration is intended for local development; production deployment, production-grade authentication, and deployment-specific configuration should be addressed before using the application in a real enterprise environment.
