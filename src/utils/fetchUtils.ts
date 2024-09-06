// utils/fetchUtils.js

export const BASE_URL = 'http://localhost:3000'; // Replace with your API base URL

const fetchUtils = async (endpoint: string, options: any = {}) => {
  const { method = 'GET', headers = {}, body } = options;

  const config: any = {
    method,
    headers: {
      'accept': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = body;
  }
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
    
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default fetchUtils;
