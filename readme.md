# API Monitoring Monorepo

This monorepo integrates both the frontend and backend applications for the API Monitoring project, delivering a robust solution for real-time tracking and visualization of API usage, performance, and health. By consolidating these components within a single repository, this setup optimizes development workflows, fosters collaboration, and ensures seamless integration between the backend services and the frontend dashboard.

## Project Structure

```
api-monitoring/
├── package.json                # Root package.json with workspaces and scripts
├── frontend/                   # Frontend application (React)
│   ├── package.json
│   ├── src/
│   └── ...other frontend files
├── api-monitoring-dashboard/   # Backend application (NestJS)
│   ├── package.json
│   ├── src/
│   └── ...other backend files
└── ...other shared configuration files
```

- `frontend/`: Contains the React frontend application.
- `api-monitoring-dashboard/`: Contains the NestJS backend application.

## Prerequisites

- **Node.js**: Make sure you have Node.js (version 14 or higher) installed.
- **npm**: npm comes with Node.js. Ensure you have npm version 7 or higher to support workspaces.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/api-monitoring.git
cd api-monitoring
```

### 2. Install Dependencies

From the root of the monorepo, run:

```bash
npm install
```

This command will install all dependencies for both the frontend and backend projects using npm workspaces.

### 3. Environment Variables

#### Frontend

If needed edit the variables in the `.env` file for frontend, navigate to the frontend directory:

```bash
cd frontend
```

```dotenv
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

#### Backend

If needed edit the variables in the `.env` file for backend, navigate to the `api-monitoring-dashboard` directory:

```bash
cd api-monitoring-dashboard
```

```dotenv
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
VITE_SOCKET_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=api_monitoring
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
```

Ensure you have a PostgreSQL database running with the above credentials.

### 4. Running the Applications

From the root of the monorepo, you can start both the frontend and backend applications simultaneously using the following command:

```bash
npm start
```

This command uses `concurrently` to run both applications:

- **Backend**: Runs `npm run start:dev` in the `api-monitoring-dashboard` workspace.
- **Frontend**: Runs `npm run dev` in the `frontend` workspace.

### 5. Accessing the Applications

- **Frontend**: Open your browser and navigate to [http://localhost:5173](http://localhost:5173).
- **Backend API**: Accessible at [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the root `package.json`, the following scripts are available:

### Start Both Applications

```bash
npm start
```

### Build Both Applications

```bash
npm run build
```

Builds the backend and frontend applications.

### Test Both Applications

```bash
npm test
```

Runs tests for the backend and frontend applications.

## Scripts Explanation

```json
{
  "scripts": {
    "start": "concurrently \"npm run start:dev --workspace=api-monitoring-dashboard\" \"npm run dev --workspace=frontend\"",
    "build": "npm run build --workspace=api-monitoring-dashboard && npm run build --workspace=frontend",
    "test": "npm test --workspace=api-monitoring-dashboard && npm test --workspace=frontend"
  }
}
```

- **start**: Uses `concurrently` to run both the backend and frontend development servers at the same time.
  - **Backend**: `npm run start:dev --workspace=api-monitoring-dashboard`
    - Starts the NestJS backend in development mode with hot reloading.
  - **Frontend**: `npm run dev --workspace=frontend`
    - Starts the React frontend in development mode with hot reloading.
- **build**: Builds both the backend and frontend applications for production.
  - **Backend**: `npm run build --workspace=api-monitoring-dashboard`
  - **Frontend**: `npm run build --workspace=frontend`
- **test**: Runs tests for both the backend and frontend applications.
  - **Backend**: `npm test --workspace=api-monitoring-dashboard`
  - **Frontend**: `npm test --workspace=frontend`

## Additional Notes

### Managing Dependencies

To add a dependency to a specific workspace, use:

```bash
npm install <package-name> --workspace=frontend
```

or

```bash
npm install <package-name> --workspace=api-monitoring-dashboard
```

### Shared Configurations

You can place shared configuration files (e.g., ESLint, Prettier) at the root of the monorepo and extend them in each workspace.
