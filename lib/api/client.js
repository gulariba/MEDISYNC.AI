/**
 * Centralized API client for MediSync.ai frontend.
 * Handles JWT auth headers, error parsing, and 401 auto-logout.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'medisync_token';

export const tokenStore = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null),
  set: (token) => { if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token); },
  remove: () => { if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY); },
};

export class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export async function apiFetch(path, options = {}) {
  const token = tokenStore.get();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 401) {
      tokenStore.remove();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      throw new ApiError('Session expired — please sign in again', 401);
    }

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
      const message =
        (typeof data === 'object' && data !== null && (data.detail || data.message)) ||
        `Request failed (${res.status})`;
      throw new ApiError(message, res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new ApiError('Cannot reach the server. Please check your connection.', 0);
    }
    throw new ApiError(err.message || 'Something went wrong', 0);
  }
}

/* ── Auth endpoints ── */
export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (email, password, role, name) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, role, name }) }),

  me: () => apiFetch('/auth/me'),
};
