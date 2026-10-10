# Enterprise Service Desk

### Full-Stack Service Request Management Platform

A full-stack web application for managing enterprise service requests through a centralized dashboard. Built with **Angular 22, ASP.NET Core Web API (.NET 8), Entity Framework Core, and SQL Server LocalDB**, the application demonstrates end-to-end frontend/backend integration and RESTful CRUD workflows.

The project focuses on practical enterprise application development, including API design, data persistence, server-side validation, status and priority management, and maintainable frontend architecture.

---

## Project Overview

Enterprise Service Desk provides a centralized interface for tracking and managing service requests throughout their lifecycle.

Users can create requests, review existing records, search and filter requests, update their details, and remove records when necessary. The Angular frontend communicates with the ASP.NET Core API, which validates requests and handles database operations through Entity Framework Core.

**Project type:** Full-stack portfolio application
**Primary focus:** Enterprise web development and REST API integration
**Architecture:** Angular SPA + ASP.NET Core Web API + SQL Server LocalDB

## Architecture

```text
┌──────────────────────────────────┐
│        Angular 22 Frontend       │
│                                  │
│  Dashboard · Request Management  │
│  Search · Filters · Forms        │
└────────────────┬─────────────────┘
                 │
                 │ HTTP / REST / JSON
                 ▼
┌──────────────────────────────────┐
│     ASP.NET Core Web API         │
│             .NET 8               │
│                                  │
│  CRUD Endpoints · Validation     │
│  HTTP Status Codes               │
└────────────────┬─────────────────┘
                 │
                 │ Entity Framework Core
                 ▼
┌──────────────────────────────────┐
│       SQL Server LocalDB         │
│                                  │
│        Service Requests          │
└──────────────────────────────────┘
```

### Architectural responsibilities

* **Frontend:** Presents the dashboard, request list, search and filtering controls, and create/edit forms.
* **Request service:** Separates HTTP communication from Angular UI components.
* **Web API:** Exposes REST endpoints, validates input, and handles request operations.
* **Entity Framework Core:** Provides database access through the application's data context.
* **SQL Server LocalDB:** Stores service request records for local development.

## Implemented Features

### Dashboard and Request Monitoring

* Overview of service requests and priority distribution.
* Recent request information.
* Visual organization of request status and priority.

### Service Request Management

* Create new service requests.
* Retrieve individual requests and the complete request list.
* Update existing request details.
* Delete requests.
* Assign Low, Medium, or High priority.
* Track Open, In Progress, and Closed statuses.

### Search and Filtering

* Search for service requests.
* Filter requests by status.
* Review and manage records through a dedicated request interface.

### Validation and API Responses

* Validate required title and description fields.
* Enforce maximum field lengths.
* Validate allowed priority and status values when updating requests.
* Return appropriate HTTP responses for successful operations, invalid input, and missing records.

## End-to-End Request Flow

A typical request creation workflow follows these steps:

1. A user enters service request details in the Angular form.
2. The Angular request service sends an HTTP POST request to the Web API.
3. ASP.NET Core validates the submitted data.
4. Entity Framework Core persists the record to SQL Server LocalDB.
5. The API returns the result to the frontend.
6. The Angular interface refreshes its data to reflect the saved request.

The same frontend-to-backend flow supports retrieving, updating, and deleting requests through their respective REST endpoints.

## Technology Stack

| Layer                     | Technology                               |
| ------------------------- | ---------------------------------------- |
| Frontend                  | Angular 22, TypeScript                   |
| Backend                   | ASP.NET Core Web API, .NET 8             |
| Data access               | Entity Framework Core                    |
| Database                  | SQL Server LocalDB                       |
| API documentation         | Swagger / OpenAPI                        |
| Testing framework         | xUnit                                    |
| Integration testing setup | ASP.NET Core Test Host, EF Core InMemory |
| Version control           | Git, GitHub                              |

## REST API

The API exposes the following endpoints:

| Method | Endpoint             | Description                   |
| ------ | -------------------- | ----------------------------- |
| GET    | `/api/requests`      | Retrieve all service requests |
| GET    | `/api/requests/{id}` | Retrieve a request by ID      |
| POST   | `/api/requests`      | Create a service request      |
| PUT    | `/api/requests/{id}` | Update an existing request    |
| DELETE | `/api/requests/{id}` | Delete a service request      |

### API behavior

* Successful retrieval and updates return appropriate success responses.
* Request creation validates input and returns the created record.
* Missing records return `404 Not Found`.
* Invalid request data returns `400 Bad Request`.
* Successful deletion returns `204 No Content`.

## Running the Application Locally

### Prerequisites

* .NET 8 SDK or compatible tooling for the API.
* Node.js and npm compatible with the Angular project.
* SQL Server LocalDB.
* Git.

### 1. Clone the repository

```powershell
git clone https://github.com/BHINDZ/EnterpriseServiceDesk.git
cd EnterpriseServiceDesk
```

### 2. Start the backend API

From the repository root:

```powershell
dotnet run --project .\EnterpriseServiceDesk.Api\EnterpriseServiceDesk.Api.csproj --urls http://localhost:5000
```

API base URL:

`http://localhost:5000`

Swagger UI:

`http://localhost:5000/swagger`

### 3. Start the Angular frontend

Open a second terminal:

```powershell
cd .\enterprise-service-desk-ui
npm install
npx ng serve
```

Open the application:

`http://localhost:4200`

### 4. Database configuration

The local development configuration uses SQL Server LocalDB:

```text
Server=(localdb)\MSSQLLocalDB;Database=EnterpriseServiceDeskDb;Trusted_Connection=True;TrustServerCertificate=True;
```

Ensure LocalDB is installed and the database is initialized according to the API's configuration.

## Verification and Testing

### Manually verified

* API and Angular builds complete successfully.
* Creating a request through the Angular UI persists it through the API.
* Created records can be retrieved through the API.
* Updating a request through the UI persists the changed priority.
* Deleting a request through the UI removes it from the API.

### Automated testing

An xUnit test project includes API integration test setup for scenarios such as successful creation, invalid input, missing records, updating, and deleting.

**Current limitation:** Automated test execution is blocked by a Windows Application Control policy that prevents the test assembly from loading. The test suite must be executed in an approved environment before its results can be reported as passing.

## Engineering Practices Demonstrated

* RESTful API design and HTTP semantics.
* Separation of frontend components and API communication.
* Dependency injection and Entity Framework Core integration.
* Server-side validation and data handling.
* End-to-end frontend/backend integration.
* CRUD operations and database persistence.
* Source control and project documentation.
* Manual verification of application workflows.

## Scope and Future Enhancements

This project is a portfolio demonstration using a local development database.

Potential next steps include:

* Authentication and role-based authorization.
* Centralized exception handling and structured logging.
* Automated testing in an approved environment.
* Production database configuration and migrations.
* Cloud deployment and CI/CD integration.
* Audit history, assignment workflows, and service-level tracking.

These are potential enhancements, not features currently claimed as implemented.

## Repository

**GitHub:** https://github.com/BHINDZ/EnterpriseServiceDesk

This project demonstrates practical full-stack development using Angular, ASP.NET Core, and SQL Server, with an emphasis on API integration, data persistence, validation, and maintainable application structure.
