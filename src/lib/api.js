const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let token = localStorage.getItem('authToken');

export const setAuthToken = (newToken) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('authToken', newToken);
  } else {
    localStorage.removeItem('authToken');
  }
};

const request = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const auth = {
  signup: (email, password, fullName, role, profileData) => {
    return request('POST', '/api/auth/signup', {
      email,
      password,
      full_name: fullName,
      role,
      ...profileData,
    });
  },

  signin: (email, password) => {
    return request('POST', '/api/auth/signin', {
      email,
      password,
    });
  },

  getProfile: () => {
    return request('GET', '/api/auth/profile');
  },

  logout: () => {
    setAuthToken(null);
  },
};

export const appointments = {
  list: () => {
    return request('GET', '/api/appointments');
  },

  create: (doctorId, appointmentDate, appointmentTime, reason) => {
    return request('POST', '/api/appointments', {
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      reason,
    });
  },

  update: (id, status, notes) => {
    return request('PUT', `/api/appointments/${id}`, {
      status,
      notes,
    });
  },

  delete: (id) => {
    return request('DELETE', `/api/appointments/${id}`);
  },
};

export const doctors = {
  list: () => {
    return request('GET', '/api/doctors');
  },
};

export const admin = {
  getUsers: () => {
    return request('GET', '/api/admin/users');
  },

  getAppointments: () => {
    return request('GET', '/api/admin/appointments');
  },
};
