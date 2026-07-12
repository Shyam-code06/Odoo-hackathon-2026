/**
 * TransitOps Core Configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// When true, the Service Layer will return mock responses from local JSON or mock structures
// When false, the Service Layer will utilize the Axios HTTP client to fetch live data
export const USE_MOCK_DATA = false;
