# MongoDB Setup Guide

This guide will help you set up MongoDB for the Hospital Appointment System.

## Option 1: Local MongoDB Installation

### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
```

### Windows
Download and install from [mongodb.com/download/community](https://www.mongodb.com/download/community)

## Option 2: MongoDB Atlas (Cloud)

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address
6. Get the connection string
7. Update `.env` file with the connection string:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/hospital-app?retryWrites=true&w=majority
   ```

## Verify MongoDB Connection

### Local MongoDB
```bash
mongosh
# Or if using older versions:
mongo
```

Then try connecting:
```bash
use hospital-app
db.users.insertOne({ test: true })
db.users.findOne()
db.users.deleteOne({ test: true })
```

### MongoDB Atlas
Replace `MONGO_URL` in `.env` with your Atlas connection string.

## Database Collections

The application automatically creates the following collections in MongoDB:

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique index),
  password: String (hashed),
  full_name: String,
  role: String ('patient' | 'doctor' | 'admin'),
  phone: String (optional),
  specialization: String (optional - for doctors),
  license_number: String (optional - for doctors),
  date_of_birth: String (optional - for patients),
  created_at: Date,
  updated_at: Date
}
```

### Appointments Collection
```javascript
{
  _id: ObjectId,
  patient_id: ObjectId (reference to users),
  doctor_id: ObjectId (reference to users),
  appointment_date: String (YYYY-MM-DD),
  appointment_time: String (HH:MM),
  status: String ('pending' | 'confirmed' | 'completed' | 'cancelled'),
  reason: String,
  notes: String (optional),
  created_at: Date,
  updated_at: Date
}
```

## Starting the Application

Once MongoDB is running and `.env` is configured:

```bash
npm install
npm run dev
```

The application will:
- Start the backend server on `http://localhost:5000`
- Start the frontend on `http://localhost:5173`
- Automatically create collections when first accessed

## Troubleshooting

### MongoDB Connection Refused
- Ensure MongoDB is running
- Check the `MONGO_URL` in `.env`
- Verify port 27017 is accessible (local) or IP is whitelisted (Atlas)

### Collections Not Created
- Collections are created automatically when first accessed
- Check backend logs for any errors

### Authentication Issues
- Verify MongoDB credentials in connection string
- For Atlas, ensure IP is whitelisted

## Backing Up Data

### Local MongoDB
```bash
mongodump --db hospital-app --out ./backup
mongorestore --db hospital-app ./backup/hospital-app
```

### MongoDB Atlas
Use the built-in backup feature in the MongoDB Atlas dashboard.
