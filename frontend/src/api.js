export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...options.headers,
  };

  // Only add Content-Type if not FormData (browser adds it automatically for FormData with boundary)
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `API error: ${response.status} ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData.message) errorMsg = errData.message;
      } catch (e) {
        // Not JSON, ignore
      }
      throw new Error(errorMsg);
    }

    // Attempt to parse JSON; fallback if not JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};
