const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function getErrorMessage(response, defaultMsg = 'Prediction failed') {
  try {
    const error = await response.json();
    return error.detail || error.message || defaultMsg;
  } catch {
    return `${defaultMsg} (Server returned ${response.status} ${response.statusText || 'Error'})`;
  }
}

export async function predictFromFile(file, topK = 3) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/predict/file?top_k=${topK}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Prediction failed'));
  }

  return response.json();
}

export async function predictFromURL(url, topK = 3) {
  const response = await fetch(`${API_BASE_URL}/predict/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, top_k: topK }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Prediction failed'));
  }

  return response.json();
}

export async function predictFromBase64(base64Image, topK = 3) {
  const response = await fetch(`${API_BASE_URL}/predict/base64`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, top_k: topK }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Prediction failed'));
  }

  return response.json();
}

export async function getBreeds(options = {}) {
  const { animalType, search, region, primaryUse, minMilk, maxMilk, sortBy } = typeof options === 'string' 
    ? { animalType: options, search: arguments[1] } 
    : options;

  const params = new URLSearchParams();
  if (animalType) params.append('animal_type', animalType);
  if (search) params.append('search', search);
  if (region) params.append('region', region);
  if (primaryUse) params.append('primary_use', primaryUse);
  if (minMilk !== undefined && minMilk !== null && minMilk !== '') params.append('min_milk', minMilk);
  if (maxMilk !== undefined && maxMilk !== null && maxMilk !== '') params.append('max_milk', maxMilk);
  if (sortBy) params.append('sort_by', sortBy);

  const response = await fetch(`${API_BASE_URL}/breeds?${params}`);
  if (!response.ok) throw new Error('Failed to fetch breeds');
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    throw new Error('API returned HTML instead of JSON (Endpoint not found)');
  }
  return response.json();
}

export async function getBreedDetail(breedName) {
  const response = await fetch(`${API_BASE_URL}/breeds/${encodeURIComponent(breedName)}`);
  if (!response.ok) throw new Error('Breed not found');
  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}

export async function getVersion() {
  const response = await fetch(`${API_BASE_URL}/version`);
  return response.json();
}
