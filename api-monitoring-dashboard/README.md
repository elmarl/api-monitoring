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
