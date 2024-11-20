# API Usage Monitoring Dashboard Backend

![API Monitoring](https://img.shields.io/badge/NestJS-Module-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue)
![Redis](https://img.shields.io/badge/Redis-Integrated-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Connected-blue)
![Jest](https://img.shields.io/badge/Jest-Testing-green)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Middleware Integration](#middleware-integration)
  - [Example Middleware Implementation](#example-middleware-implementation)
  - [Hooking Up API Usage Monitoring](#hooking-up-api-usage-monitoring)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [End-to-End (E2E) Tests](#end-to-end-e2e-tests)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Welcome to the **API Usage Monitoring Dashboard Backend**! This project provides a robust backend solution for tracking and visualizing API usage in real-time. It enables developers to monitor their APIs, ensuring optimal performance and quick detection of issues.

## Features

- **User Authentication & Management**
  - User registration and login with JWT authentication.
- **API Key Management**
  - Generate, list, and revoke API keys for tracking API usage.
- **Usage Data Ingestion**
  - Receive and log API usage data from client applications.
- **Real-Time Data Processing**
  - Utilize Redis Pub/Sub for real-time data streaming.
- **WebSockets Integration**
  - Provide real-time updates to the frontend dashboard.
- **Example Middleware**
  - Included middleware example for easy integration with client applications.
- **Comprehensive Testing**
  - Unit and End-to-End (E2E) tests to ensure reliability.

## Architecture

The backend is built with **NestJS** and **TypeScript**, leveraging **PostgreSQL** for persistent storage and **Redis** for real-time data processing. **Socket.io** is used to facilitate real-time communication between the backend and frontend.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/elmarl/api-usage-monitoring-dashboard.git
   ```

# Installation

## Clone the Repository

```bash
git clone https://github.com/elmarl/api-usage-monitoring-dashboard.git
cd api-usage-monitoring-dashboard
```

## Install Dependencies

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

```dotenv
# .env file

# Application Configuration
PORT=3000
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=api_monitoring

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Running the Application

To start the application in development mode with hot reloading:

```bash
npm run start:dev
```

The backend server will start on [http://localhost:3000](http://localhost:3000) by default.

To build the application for production:

```bash
npm run build
```

To start the built application:

```bash
npm run start:prod
```

## Middleware Integration

To monitor API usage from your client applications, you can integrate the provided middleware. This middleware captures API request data and sends it to the backend for logging and analysis.

### Example Middleware Implementation

Here's an example of how to implement the middleware in a Node.js Express application:

```javascript
// api-monitoring-middleware.js

const axios = require('axios');

function apiMonitoringMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const usageData = {
      apiKey: 'your-api-key',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: duration,
      timestamp: new Date().toISOString(),
    };

    axios.post('http://localhost:3000/usage', usageData).catch((error) => {
      console.error('Error sending usage data:', error.message);
    });
  });

  next();
}

module.exports = apiMonitoringMiddleware;
```

#### Integrate Middleware into Your Application

```javascript
// app.js

const express = require('express');
const apiMonitoringMiddleware = require('./api-monitoring-middleware');

const app = express();

// Use the API monitoring middleware
app.use(apiMonitoringMiddleware);

// ... your routes and other middleware ...

app.listen(4000, () => {
  console.log('Application is running on port 4000');
});
```

## Hooking Up API Usage Monitoring

To enable API usage monitoring:

### Generate an API Key

Use the backend's API to generate an API key for your application.

- **Endpoint**: `POST /api-keys`
- **Headers**:

```makefile
Authorization: Bearer <your_jwt_token>
```

### Include the API Key in the Middleware

Replace `'your-api-key'` in the middleware with the API key you generated.

### Configure Backend URL

Ensure that the middleware points to the correct backend URL where the usage data should be sent (e.g., `http://localhost:3000/usage`).

## Testing

### Unit Tests

The project includes unit tests to verify the functionality of individual components.

#### Running Unit Tests:

```bash
npm run test
```

#### Test Coverage Report:

To generate a test coverage report:

```bash
npm run test:cov
```

The coverage report will be available in the `coverage` directory.

### End-to-End (E2E) Tests

End-to-End tests verify the application's functionality from start to finish, ensuring all components work together as expected.

#### Running E2E Tests:

```bash
npm run test:e2e
```

**Note**: Ensure that the application and all dependencies (e.g., PostgreSQL, Redis) are running before executing E2E tests.

## API Endpoints

### Authentication

#### Register a New User

**Endpoint**: `POST /auth/register`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "your_password",
  "name": "Your Name"
}
```

#### User Login

**Endpoint**: `POST /auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response**:

```json
{
  "access_token": "your_jwt_token"
}
```

### API Key Management

#### Generate a New API Key

**Endpoint**: `POST /api-keys`

**Headers**:

```makefile
Authorization: Bearer <your_jwt_token>
```

#### List API Keys

**Endpoint**: `GET /api-keys`

**Headers**:

```makefile
Authorization: Bearer <your_jwt_token>
```

#### Revoke an API Key

**Endpoint**: `DELETE /api-keys/:id`

**Headers**:

```makefile
Authorization: Bearer <your_jwt_token>
```

### Usage Data

#### Submit Usage Data

**Endpoint**: `POST /usage`

**Request Body**:

```json
{
  "method": "GET",
  "endpoint": "/api/resource",
  "statusCode": 200,
  "responseTime": 123,
  "timestamp": "2023-04-01T12:34:56.789Z"
}
```

**Headers**:

```makefile
Authorization: Bearer <your_api_key>
```

## Folder Structure

```
api-monitoring-dashboard/
├── src/
│   ├── api-keys/
│   ├── auth/
│   ├── usage/
│   ├── users/
│   ├── main.ts
│   └── app.module.ts
├── test/
│   ├── e2e/
│   └── unit/
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

### Fork the Repository

Click the "Fork" button at the top right of the repository page.

### Clone Your Fork

```bash
git clone https://github.com/yourusername/api-usage-monitoring-dashboard.git
cd api-usage-monitoring-dashboard
```

### Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

### Make Your Changes

### Commit and Push

```bash
git add .
git commit -m "Add your commit message here"
git push origin feature/your-feature-name
```

### Create a Pull Request

- Go to your forked repository on GitHub.
- Click on "Compare & pull request".
- Submit your pull request for review.

## License

This project is licensed under the MIT License.
