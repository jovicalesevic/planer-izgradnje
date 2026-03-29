import { useAuth } from '@clerk/react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

function errorMessageFromBody(body, fallback) {
  const e = body?.error;
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object' && typeof e.message === 'string') return e.message;
  if (e && typeof e === 'object') return JSON.stringify(e);
  return fallback;
}

export function useApi() {
  const { getToken } = useAuth();

  async function request(url, options = {}) {
    const token = await getToken();
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(errorMessageFromBody(body, response.statusText));
    }
    if (response.status === 204) return null;
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  }

  return {
    getInstitucije: () => request(`${API_BASE}/institucije`),

    getProjekti: () => request(`${API_BASE}/projekti`),

    createProjekat: (data) =>
      request(`${API_BASE}/projekti`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getProjekat: (id) => request(`${API_BASE}/projekti/${id}`),

    updateProjekat: (id, data) =>
      request(`${API_BASE}/projekti/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteProjekat: (id) =>
      request(`${API_BASE}/projekti/${id}`, {
        method: 'DELETE',
      }),

    getChecklist: (projekatId) => request(`${API_BASE}/checklist/${projekatId}`),

    /** Vraća { ukupno, zavrseno, procenat } za dokumente u checklisti */
    getNapredak: (projekatId) =>
      request(`${API_BASE}/checklist/napredak/${projekatId}`),

    createChecklist: (projekatId, faze = []) =>
      request(`${API_BASE}/checklist/${projekatId}`, {
        method: 'POST',
        body: JSON.stringify({ faze }),
      }),

    updateFaza: (projekatId, fazaId, data) =>
      request(`${API_BASE}/checklist/${projekatId}/faza/${fazaId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    updateDokument: (projekatId, fazaId, dokumentId, data) =>
      request(
        `${API_BASE}/checklist/${projekatId}/faza/${fazaId}/dokument/${dokumentId}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      ),

    getAdminInstitucije: () => request(`${API_BASE}/admin/institucije`),

    createAdminInstitucija: (data) =>
      request(`${API_BASE}/admin/institucije`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    deleteAdminInstitucija: (id) =>
      request(`${API_BASE}/admin/institucije/${id}`, {
        method: 'DELETE',
      }),

    uploadDokument: async (projekatId, fazaId, dokumentId, fajl) => {
      const token = await getToken();
      const formData = new FormData();
      formData.append('fajl', fajl);

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE}/upload/${projekatId}/faza/${fazaId}/dokument/${dokumentId}`,
        {
          method: 'POST',
          body: formData,
          headers,
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(errorMessageFromBody(body, response.statusText));
      }
      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text);
    },

    deleteFajl: (projekatId, fazaId, dokumentId, fajlId) =>
      request(
        `${API_BASE}/upload/${projekatId}/faza/${fazaId}/dokument/${dokumentId}/fajl/${fajlId}`,
        { method: 'DELETE' }
      ),
  };
}
