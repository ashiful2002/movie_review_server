# FoodHub Backend ⚙️

## Overview

The FoodHub Backend is the server-side application responsible for
handling business logic, authentication, database operations, and API
endpoints.

It provides REST APIs that the frontend consumes to manage meals, users,
and orders.

------------------------------------------------------------------------

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB / PostgreSQL
-   JWT Authentication
-   bcrypt (password hashing)

------------------------------------------------------------------------

## Core Responsibilities

-   User authentication
-   Role-based authorization
-   CRUD operations for meals
-   Order management
-   Review management
-   Admin moderation

------------------------------------------------------------------------

## API Endpoints

### Authentication

POST /api/auth/register\
POST /api/auth/login\
GET /api/auth/me

------------------------------------------------------------------------

### Meals

GET /api/meals\
GET /api/meals/:id

------------------------------------------------------------------------

### Providers

GET /api/providers\
GET /api/providers/:id

------------------------------------------------------------------------

### Orders

POST /api/orders\
GET /api/orders\
GET /api/orders/:id

------------------------------------------------------------------------

### Provider Management

POST /api/provider/meals\
PUT /api/provider/meals/:id\
DELETE /api/provider/meals/:id\
PATCH /api/provider/orders/:id

------------------------------------------------------------------------

### Admin

GET /api/admin/users\
PATCH /api/admin/users/:id

------------------------------------------------------------------------

## Database Tables

### Users

Stores authentication and role information.

### ProviderProfiles

Additional information for providers.

### Categories

Food categories (cuisine types).

### Meals

Menu items offered by providers.

### Orders

Customer orders including items and status.

### Reviews

Customer feedback for meals.

------------------------------------------------------------------------

## Order Status Flow

PLACED → PREPARING → READY → DELIVERED

Optional: CANCELLED

------------------------------------------------------------------------

## Running the Backend

1.  Install dependencies

npm install

2.  Configure environment variables

Create `.env`

PORT=5000 DB_URI=your_database_connection JWT_SECRET=your_secret_key

3.  Start server

npm run dev

or

node server.js

Server runs at:

http://localhost:5000

------------------------------------------------------------------------

## Security

-   Passwords hashed with bcrypt
-   JWT authentication
-   Role-based access control
-   Protected routes for customer, provider, and admin
