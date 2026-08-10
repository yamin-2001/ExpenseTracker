# Expense Tracker Full-Stack Application

This is a full-stack expense tracker built with Node.js, Express, MongoDB, and React. It allows users to register, log in, and manage their personal income and expenses.

## Project Overview

- **Backend**: RESTful API using Node.js, Express.js, and MongoDB (via Mongoose).
- **Frontend**: Single Page Application built with React (Vite) and Tailwind CSS v4.
- **Features**: Authentication (JWT), Dashboard with financial summary, Transaction management (CRUD & Filtering), Category management (Income/Expense).

## Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or Atlas cluster)

## Installation Steps

1. **Clone or extract the repository**.
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
   JWT_SECRET=yoursupersecretkey
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

## How to run

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   # Server will run on http://localhost:5000
   ```

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   # App will run on http://localhost:5173
   ```

## Default Environment Variables

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker`
- `JWT_SECRET=secret123`


