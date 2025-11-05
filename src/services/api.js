const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // First check if the server is reachable
      if (!response) {
        throw new Error('Cannot connect to the server. Please check if the backend server is running.');
      }

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          throw new Error('Invalid response from server');
        }
      } else {
        // If response is not JSON, check if it's a server error
        if (!response.ok) {
          throw new Error('Server error: ' + response.status);
        }
        return response;
      }

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.message || data.errors?.[0]?.msg || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:5001');
      }
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Appointment methods
  // (no duplicate getCurrentUser) Appointment-related methods follow

  async resetPassword(email) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { email }
    });
  }

  // Appointments
  async getAppointments(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/appointments?${queryString}`, {
      method: 'GET',
    });
  }

  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: appointmentData,
    });
  }

  async updateAppointment(id, updates) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: updates,
    });
  }

  async deleteAppointment(id) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // User methods
  async getUsers() {
    return this.request('/users');
  }

  async getDoctors() {
    return this.request('/users/doctors');
  }
}

export default new ApiService();
