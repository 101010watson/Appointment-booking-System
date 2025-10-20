import React from 'react';

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">About Our Hospital Appointment System</h1>
          <p className="text-xl">Streamlining healthcare access through digital innovation</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We strive to make healthcare more accessible by bridging the gap between patients
              and healthcare providers. Our appointment system simplifies the booking process,
              reduces wait times, and ensures efficient healthcare delivery.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Key Features</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Easy online appointment booking</li>
                <li>• Real-time availability updates</li>
                <li>• Automated reminders</li>
                <li>• Secure patient information</li>
                <li>• Multi-specialty support</li>
              </ul>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose Us</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Patients</h3>
                <p className="text-gray-600">
                  Book appointments 24/7, view doctor schedules, receive timely reminders,
                  and manage your medical appointments effortlessly.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Doctors</h3>
                <p className="text-gray-600">
                  Manage your schedule efficiently, view patient history, and reduce no-shows
                  with our integrated notification system.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Administrators</h3>
                <p className="text-gray-600">
                  Monitor appointments, manage doctor schedules, and optimize resource allocation
                  with comprehensive analytics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">Patient Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Online Booking</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Healthcare Providers</div>
          </div>
        </div>
      </div>
    </div>
  );
};