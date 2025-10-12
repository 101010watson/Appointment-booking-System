/*
  # Hospital Appointment Management System - Database Schema

  ## Overview
  This migration creates a comprehensive hospital appointment management system with role-based access control.

  ## 1. New Tables

  ### `profiles`
  Extended user profile information linked to Supabase auth.users
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'patient', 'doctor', or 'admin'
  - `phone` (text, nullable) - Contact phone number
  - `specialization` (text, nullable) - Doctor's specialization (doctors only)
  - `license_number` (text, nullable) - Doctor's license number (doctors only)
  - `date_of_birth` (date, nullable) - Patient's birth date (patients only)
  - `address` (text, nullable) - User's address
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `appointments`
  Appointment scheduling and management
  - `id` (uuid, primary key) - Unique appointment identifier
  - `patient_id` (uuid) - References profiles(id) for patient
  - `doctor_id` (uuid) - References profiles(id) for doctor
  - `appointment_date` (date) - Date of appointment
  - `appointment_time` (time) - Time of appointment
  - `status` (text) - Appointment status: 'pending', 'confirmed', 'completed', 'cancelled'
  - `reason` (text) - Reason for appointment
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz) - Appointment creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies:

  #### Profiles Table Policies:
  - Users can view their own profile
  - Patients can view doctor profiles
  - Doctors can view patient profiles they have appointments with
  - Admins can view all profiles
  - Users can update their own profile
  - Admins can update any profile

  #### Appointments Table Policies:
  - Patients can view their own appointments
  - Doctors can view appointments assigned to them
  - Admins can view all appointments
  - Patients can create appointments for themselves
  - Doctors can update appointments assigned to them
  - Patients can cancel their own pending appointments
  - Admins can manage all appointments

  ## 3. Indexes
  - Index on profiles.role for role-based queries
  - Index on appointments.patient_id for patient lookups
  - Index on appointments.doctor_id for doctor lookups
  - Index on appointments.appointment_date for date-based queries
  - Index on appointments.status for status filtering

  ## 4. Important Notes
  - All sensitive operations require authentication
  - Role-based access is enforced at the database level
  - Timestamps are automatically managed with triggers
  - Foreign key constraints ensure data integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  phone text,
  specialization text,
  license_number text,
  date_of_birth date,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  reason text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (patient_id != doctor_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies

-- SELECT policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can view doctor profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    role = 'doctor' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'patient'
    )
  );

CREATE POLICY "Doctors can view patient profiles with appointments"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    role = 'patient'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'doctor'
    )
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.patient_id = profiles.id
      AND appointments.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- INSERT policy for profiles
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE policies for profiles
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Appointments RLS Policies

-- SELECT policies for appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view assigned appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- INSERT policy for appointments
CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    patient_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'patient'
    )
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = doctor_id
      AND profiles.role = 'doctor'
    )
  );

-- UPDATE policies for appointments
CREATE POLICY "Doctors can update assigned appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Patients can cancel own pending appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    patient_id = auth.uid()
    AND status = 'pending'
  )
  WITH CHECK (
    patient_id = auth.uid()
    AND status = 'cancelled'
  );

CREATE POLICY "Admins can update any appointment"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- DELETE policy for appointments
CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();