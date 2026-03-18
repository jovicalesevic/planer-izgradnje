const API_BASE = 'https://planer-izgradnje-api.onrender.com/api';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || response.statusText);
  }
  return response.json();
}

export async function getInstitucije() {
  return request(`${API_BASE}/institucije`);
}

export async function getProjekti() {
  return request(`${API_BASE}/projekti`);
}

export async function createProjekat(data) {
  return request(`${API_BASE}/projekti`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProjekat(id) {
  return request(`${API_BASE}/projekti/${id}`);
}

export async function updateProjekat(id, data) {
  return request(`${API_BASE}/projekti/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProjekat(id) {
  return request(`${API_BASE}/projekti/${id}`, {
    method: 'DELETE',
  });
}

export async function getChecklist(projekatId) {
  return request(`${API_BASE}/checklist/${projekatId}`);
}

export async function createChecklist(projekatId, faze = []) {
  return request(`${API_BASE}/checklist/${projekatId}`, {
    method: 'POST',
    body: JSON.stringify({ faze }),
  });
}

export async function updateFaza(projekatId, fazaId, data) {
  return request(`${API_BASE}/checklist/${projekatId}/faza/${fazaId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateDokument(projekatId, fazaId, dokumentId, data) {
  return request(`${API_BASE}/checklist/${projekatId}/faza/${fazaId}/dokument/${dokumentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
