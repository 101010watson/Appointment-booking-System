const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get appointments
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }
    // Admin can see all appointments

    const appointments = await Appointment.find(query)
      .populate('patient', 'fullName email phone dateOfBirth')
      .populate('doctor', 'fullName email specialization')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create appointment
router.post('/', [auth, authorize('patient'), [
  body('doctor').notEmpty().withMessage('Doctor is required'),
  body('appointmentDate').notEmpty().withMessage('Appointment date is required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  body('reason').notEmpty().withMessage('Reason is required')
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { doctor, appointmentDate, appointmentTime, reason } = req.body;
    
    console.log('Received appointment data:', { doctor, appointmentDate, appointmentTime, reason });

    // Verify doctor exists and is a doctor
    const doctorUser = await User.findOne({ _id: doctor, role: 'doctor' });
    if (!doctorUser) {
      return res.status(400).json({ message: 'Invalid doctor selected' });
    }

    // Check if appointment is in the future
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({ message: 'Cannot book appointments in the past' });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor,
      appointmentDate,
      appointmentTime,
      reason
    });

    await appointment.save();
    await appointment.populate('patient', 'fullName email phone');
    await appointment.populate('doctor', 'fullName email specialization');

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, notes } = req.body;
    
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();
    await appointment.populate('patient', 'fullName email phone');
    await appointment.populate('doctor', 'fullName email specialization');

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete appointment (admin only)
router.delete('/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
