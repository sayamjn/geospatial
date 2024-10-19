const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error('API request failed')
  }

  return response.json()
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  const data = await response.json()
  return data.token
}

export async function register(email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Registration failed')
  }

  const data = await response.json()
  return data.token
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'File upload failed');
  }

  return response.json();
}

export async function getShapes() {
  return fetchWithAuth('/shapes')
}

export async function createShape(shape) {
  return fetchWithAuth('/shapes', {
    method: 'POST',
    body: JSON.stringify(shape),
  })
}

export async function updateShape(id, shape) {
  return fetchWithAuth(`/shapes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(shape),
  })
}

export async function deleteShape(id) {
  return fetchWithAuth(`/shapes/${id}`, {
    method: 'DELETE',
  })
}

export async function getFiles() {
  return fetchWithAuth('/files');
}
