# Migration Summary: Supabase to MongoDB

## Overview
The Hospital Appointment System has been successfully migrated from Supabase (PostgreSQL) to MongoDB with an Express.js backend API.

## Key Changes

### Backend Setup
- **Added**: Express.js server in `/server/index.js`
- **Added**: MongoDB driver with automatic collection creation and indexing
- **Added**: JWT-based authentication system
- **Authentication**: Uses bcryptjs for password hashing instead of Supabase Auth
- **API Port**: Backend runs on `http://localhost:5000`

### Database Changes
- **Removed**: Supabase migrations (`supabase/` directory)
- **Data Model**:
  - PostgreSQL relational schema → MongoDB document schema
  - Foreign key constraints → MongoDB ObjectId references
  - Triggers for `updated_at` → Manual timestamp updates in API
  - RLS Policies → Application-level authorization in API routes

### Frontend Changes
- **Removed**: `src/lib/supabase.js` - Supabase client
- **Added**: `src/lib/api.js` - Custom MongoDB API client
- **Updated**: `src/contexts/AuthContext.jsx` to use MongoDB API
  - Session storage in localStorage (JWT tokens)
  - Replaced Supabase auth with custom login/signup endpoints
- **Updated**: All page components
  - `src/pages/PatientDashboard.jsx`
  - `src/pages/DoctorDashboard.jsx`
  - `src/pages/AdminDashboard.jsx`

### Dependencies
- **Added**:
  - `express@^4.18.2` - Web framework
  - `mongodb@^6.3.0` - MongoDB driver
  - `jsonwebtoken@^9.0.0` - JWT authentication
  - `bcryptjs@^2.4.3` - Password hashing
  - `cors@^2.8.5` - Cross-origin requests
  - `concurrently@^8.2.2` - Run multiple processes
- **Removed**:
  - `@supabase/supabase-js`

### Environment Variables
- **Changed from**:
  ```
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  ```
- **Changed to**:
  ```
  VITE_API_URL=http://localhost:5000
  MONGO_URL=mongodb://localhost:27017/hospital-app
  ```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth token)

#### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

#### Doctors
- `GET /api/doctors` - Get all doctors

#### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/appointments` - Get all appointments (admin only)

## Data Model Differences

### Users Collection (MongoDB)
```javascript
{
  _id: ObjectId,           // Instead of uuid
  email: String,
  password: String,        // Hashed - managed in API
  full_name: String,
  role: String,
  phone: String,
  specialization: String,
  license_number: String,
  date_of_birth: String,
  created_at: Date,
  updated_at: Date
}
```

### Appointments Collection (MongoDB)
```javascript
{
  _id: ObjectId,           // Instead of uuid
  patient_id: ObjectId,    // Reference to users._id
  doctor_id: ObjectId,     // Reference to users._id
  appointment_date: String,
  appointment_time: String,
  status: String,
  reason: String,
  notes: String,
  created_at: Date,
  updated_at: Date
}
```

## Authentication Flow Changes

### Before (Supabase)
1. Sign up with email/password → Supabase auth service
2. Supabase creates session automatically
3. Frontend stores session in Supabase client
4. All requests use Supabase client with built-in authorization

### After (MongoDB)
1. Sign up with email/password → Express API
2. Express hashes password with bcryptjs
3. Express generates JWT token
4. Frontend stores JWT in localStorage
5. Frontend includes JWT in Authorization header for requests
6. Express verifies JWT and implements custom authorization

## Running the Application

### Development
```bash
npm run dev
```
This runs both backend and frontend concurrently.

### Production Build
```bash
npm run build
```
Creates optimized React build in `dist/` directory.

## File Structure
```
.
├── server/
│   └── index.js              # Express API server
├── src/
│   ├── components/
│   ├── contexts/
│   │   └── AuthContext.jsx   # Updated for MongoDB
│   ├── lib/
│   │   └── api.js            # MongoDB API client
│   └── pages/
│       ├── AdminDashboard.jsx
│       ├── DoctorDashboard.jsx
│       └── PatientDashboard.jsx
├── .env                      # Updated configuration
├── .env.example
├── package.json              # Updated dependencies
├── README.md                 # Setup instructions
├── MONGODB_SETUP.md         # MongoDB configuration
└── vite.config.js
```

## Migration Checklist
- [x] Create Express.js backend
- [x] Set up MongoDB connection
- [x] Implement authentication API
- [x] Implement appointment API
- [x] Implement admin endpoints
- [x] Update frontend API client
- [x] Update AuthContext
- [x] Update all page components
- [x] Update environment configuration
- [x] Remove Supabase dependencies
- [x] Build and test

## Testing After Migration

1. **Sign Up**: Create accounts as Patient, Doctor, and Admin
2. **Patient**: Book appointments with doctors
3. **Doctor**: Confirm/complete/cancel appointments
4. **Admin**: View all users and manage system
5. **JWT**: Verify tokens expire and require re-login

## Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Password hashing with bcryptjs (10 salt rounds)
- API authorization checks on all protected endpoints
- Environment variables for sensitive configuration
- CORS enabled for frontend communication

## Future Improvements

- Implement refresh token mechanism
- Add email verification
- Add password reset functionality
- Move JWT_SECRET to environment variable
- Add rate limiting
- Add request logging
- Add data validation middleware
- Add comprehensive error handling
