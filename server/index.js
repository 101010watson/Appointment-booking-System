import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/hospital-app';

app.use(cors());
app.use(express.json());

let db;
let usersCollection;
let appointmentsCollection;

const connectDB = async () => {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db('hospital-app');
    usersCollection = db.collection('users');
    appointmentsCollection = db.collection('appointments');

    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await appointmentsCollection.createIndex({ patient_id: 1 });
    await appointmentsCollection.createIndex({ doctor_id: 1 });
    await appointmentsCollection.createIndex({ appointment_date: 1 });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '24h' });
};

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name, role, phone, specialization, license_number, date_of_birth } = req.body;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = {
      email,
      password: hashedPassword,
      full_name,
      role,
      phone: phone || null,
      specialization: specialization || null,
      license_number: license_number || null,
      date_of_birth: date_of_birth || null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await usersCollection.insertOne(user);
    const token = generateToken(result.insertedId.toString(), role);

    res.json({
      user: {
        id: result.insertedId.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.role);
    res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      specialization: user.specialization,
      license_number: user.license_number,
      date_of_birth: user.date_of_birth,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctors', verifyToken, async (req, res) => {
  try {
    const doctors = await usersCollection.find({ role: 'doctor' }).toArray();
    res.json(
      doctors.map((doc) => ({
        id: doc._id.toString(),
        full_name: doc.full_name,
        specialization: doc.specialization,
        email: doc.email,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/appointments', verifyToken, async (req, res) => {
  try {
    let query = {};
    if (req.userRole === 'patient') {
      query.patient_id = new ObjectId(req.userId);
    } else if (req.userRole === 'doctor') {
      query.doctor_id = new ObjectId(req.userId);
    }

    const appointments = await appointmentsCollection
      .find(query)
      .sort({ appointment_date: -1 })
      .toArray();

    const enrichedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        let doctor = null;
        let patient = null;

        if (apt.doctor_id) {
          doctor = await usersCollection.findOne({ _id: apt.doctor_id });
        }
        if (apt.patient_id) {
          patient = await usersCollection.findOne({ _id: apt.patient_id });
        }

        return {
          id: apt._id.toString(),
          patient_id: apt.patient_id.toString(),
          doctor_id: apt.doctor_id.toString(),
          appointment_date: apt.appointment_date,
          appointment_time: apt.appointment_time,
          status: apt.status,
          reason: apt.reason,
          notes: apt.notes || null,
          created_at: apt.created_at,
          updated_at: apt.updated_at,
          doctor: doctor
            ? {
                id: doctor._id.toString(),
                full_name: doctor.full_name,
                email: doctor.email,
                specialization: doctor.specialization,
              }
            : null,
          patient: patient
            ? {
                id: patient._id.toString(),
                full_name: patient.full_name,
                email: patient.email,
                phone: patient.phone,
                date_of_birth: patient.date_of_birth,
              }
            : null,
        };
      })
    );

    res.json(enrichedAppointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'patient') {
      return res.status(403).json({ error: 'Only patients can create appointments' });
    }

    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    const doctor = await usersCollection.findOne({ _id: new ObjectId(doctor_id), role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const appointment = {
      patient_id: new ObjectId(req.userId),
      doctor_id: new ObjectId(doctor_id),
      appointment_date,
      appointment_time,
      reason,
      status: 'pending',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await appointmentsCollection.insertOne(appointment);
    res.json({ id: result.insertedId.toString(), ...appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/appointments/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await appointmentsCollection.findOne({ _id: new ObjectId(id) });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (req.userRole === 'doctor' && appointment.doctor_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (req.userRole === 'patient' && appointment.patient_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = { updated_at: new Date() };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    await appointmentsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    const updated = await appointmentsCollection.findOne({ _id: new ObjectId(id) });

    res.json({
      id: updated._id.toString(),
      patient_id: updated.patient_id.toString(),
      doctor_id: updated.doctor_id.toString(),
      appointment_date: updated.appointment_date,
      appointment_time: updated.appointment_time,
      status: updated.status,
      reason: updated.reason,
      notes: updated.notes,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete appointments' });
    }

    const { id } = req.params;
    const result = await appointmentsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const users = await usersCollection.find({}).sort({ created_at: -1 }).toArray();
    res.json(
      users.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
        specialization: user.specialization,
        created_at: user.created_at,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/appointments', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const appointments = await appointmentsCollection.find({}).sort({ appointment_date: -1 }).toArray();

    const enrichedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        const doctor = await usersCollection.findOne({ _id: apt.doctor_id });
        const patient = await usersCollection.findOne({ _id: apt.patient_id });

        return {
          id: apt._id.toString(),
          patient_id: apt.patient_id.toString(),
          doctor_id: apt.doctor_id.toString(),
          appointment_date: apt.appointment_date,
          appointment_time: apt.appointment_time,
          status: apt.status,
          reason: apt.reason,
          notes: apt.notes,
          doctor: {
            id: doctor._id.toString(),
            full_name: doctor.full_name,
            email: doctor.email,
            specialization: doctor.specialization,
          },
          patient: {
            id: patient._id.toString(),
            full_name: patient.full_name,
            email: patient.email,
            phone: patient.phone,
          },
        };
      })
    );

    res.json(enrichedAppointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

await connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
