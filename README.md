# Hospital Appointment System with MongoDB

A full-stack hospital appointment management system built with React, Express, and MongoDB.

## Features

- User authentication (Patient, Doctor, Admin roles)
- Appointment booking and management
- Doctor profiles with specializations
- Admin dashboard for system management
- Real-time appointment status updates
- Appointment notes and history

## Prerequisites

- Node.js 16+ and npm
- MongoDB 4.4+ running locally or MongoDB Atlas connection string
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hospital-appointment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and update with your settings:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000
MONGO_URL=mongodb://localhost:27017/hospital-app
```

**For MongoDB Atlas:**
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/hospital-app?retryWrites=true&w=majority
```

### 4. Start the Application

Run both the backend server and frontend development server:

```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
.
├── server/
│   └── index.js           # Express backend server
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React context (Auth)
│   ├── lib/
│   │   ├── api.js        # MongoDB API client
│   │   └── supabase.js   # (deprecated - use api.js)
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── vite.config.js        # Vite configuration
```

## Database Schema

### Users Collection
- `_id` (ObjectId)
- `email` (string, unique)
- `password` (hashed string)
- `full_name` (string)
- `role` (string: patient, doctor, admin)
- `phone` (string, optional)
- `specialization` (string, optional - for doctors)
- `license_number` (string, optional - for doctors)
- `date_of_birth` (string, optional - for patients)
- `created_at` (date)
- `updated_at` (date)

### Appointments Collection
- `_id` (ObjectId)
- `patient_id` (ObjectId - reference to users)
- `doctor_id` (ObjectId - reference to users)
- `appointment_date` (string)
- `appointment_time` (string)
- `status` (string: pending, confirmed, completed, cancelled)
- `reason` (string)
- `notes` (string, optional)
- `created_at` (date)
- `updated_at` (date)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/profile` - Get current user profile (requires token)

### Appointments
- `GET /api/appointments` - List user's appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment (admin only)

### Doctors
- `GET /api/doctors` - List all doctors

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/appointments` - List all appointments (admin only)

## Development

### Start Development Server
```bash
npm run dev
```

### Backend Only
```bash
npm run dev:backend
```

### Frontend Only
```bash
npm run dev:frontend
```

### Lint Code
```bash
npm run lint
```

## Testing the Application

1. **Sign Up**: Create a new account as Patient, Doctor, or Admin
2. **Patient Dashboard**: Book appointments with available doctors
3. **Doctor Dashboard**: View and manage your appointments
4. **Admin Dashboard**: Manage all users and appointments

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct
- Check `MONGO_URL` in `.env` file

### API Connection Error
- Backend must be running on port 5000
- Check `VITE_API_URL` in `.env` file

### Authentication Issues
- Clear browser localStorage and try again
- Check browser console for error messages
- Ensure tokens are being stored in localStorage

## Production Deployment

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Deploy the Node.js server to your hosting service
4. Update environment variables for production MongoDB and API URLs
5. Change JWT_SECRET in `server/index.js` to a secure random string

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
