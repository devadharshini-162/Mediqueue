const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  getTokens: async () => {
    const response = await fetch(`${API_BASE_URL}/tokens`);
    if (!response.ok) throw new Error('Failed to fetch tokens');
    return response.json();
  },

  registerToken: async (patientName, doctorName) => {
    const response = await fetch(`${API_BASE_URL}/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName, doctorName }),
    });
    if (!response.ok) throw new Error('Failed to register');
    return response.json();
  },

  callToken: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tokens/${id}/call`, { method: 'PUT' });
    if (!response.ok) throw new Error('Failed to call token');
    return response.json();
  },

  serveToken: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tokens/${id}/serve`, { method: 'PUT' });
    if (!response.ok) throw new Error('Failed to serve token');
    return response.json();
  },

  skipToken: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tokens/${id}/skip`, { method: 'PUT' });
    if (!response.ok) throw new Error('Failed to skip token');
    return response.json();
  },

  deleteToken: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tokens/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete token');
    return true;
  }
};
