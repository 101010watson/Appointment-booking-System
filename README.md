# Hospital Appointment Management System (MERN Stack)

A full-stack hospital appointment management system built with MongoDB, Express.js, React, and Node.js.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd appointment-booking-system
   npm run install-all
   ```

2. **Set up MongoDB**
   - Install MongoDB locally OR use MongoDB Atlas
   - Update `backend/.env` with your MongoDB URI

3. **Configure environment variables**
   
   **Backend** (`backend/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/hospital-appointments
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   ```

   **Frontend** (`.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Start backend
   npm run server
   
   # Terminal 2 - Start frontend
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/doctors` - Get doctors

## Features

- **Multi-role system** (Patient, Doctor, Admin)
- **JWT Authentication**
- **Role-based access control**
- **Real-time appointment management**
- **Responsive design**

## Project Structure

```
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Main server file
│   └── package.json
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── pages/          # Page components
│   ├── services/       # API service
│   └── App.jsx
└── package.json
```

## Usage

1. **Register** as Patient, Doctor, or Admin
2. **Patients**: Book appointments with doctors
3. **Doctors**: Manage assigned appointments
4. **Admins**: Oversee entire system

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- MongoDB default: `mongodb://localhost:27017`
