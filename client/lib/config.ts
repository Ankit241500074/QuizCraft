// API configuration for different environments
export const API_CONFIG = {
  // Local development
  development: {
    baseURL: 'http://localhost:3001', // Your local server port
  },
  // Production (Render)
  production: {
    baseURL: 'https://quizcraft-p7qu.onrender.com',
  }
};

// Get current environment
const isDevelopment = import.meta.env.DEV;
const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// Export the base URL for API calls
export const API_BASE_URL = currentConfig.baseURL;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  // If endpoint already starts with http, return as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Return full URL
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Log the current configuration for debugging
console.log('API Configuration:', {
  environment: isDevelopment ? 'development' : 'production',
  baseURL: API_BASE_URL
});
