import axios from "axios";

const API = axios.create({
  baseURL: "https://e05f-2401-4900-1cb4-bb16-e871-d39-75f1-effa.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

// Interceptor to translate frontend "/api/..." paths to the correct backend "/api/v1/..." endpoints
API.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith("/api/")) {
      // 1. Clients: frontend /api/master/clients -> backend /api/v1/clients
      if (config.url.startsWith("/api/master/clients")) {
        config.url = config.url.replace(/^\/api\/master\/clients/, "/api/v1/clients");
      }
      // 2. Contacts: frontend /api/master/contacts -> backend /api/v1/contacts
      else if (config.url.startsWith("/api/master/contacts")) {
        config.url = config.url.replace(/^\/api\/master\/contacts/, "/api/v1/contacts");
      }
      // 3. All other endpoints: /api/something -> /api/v1/something
      else if (!config.url.startsWith("/api/v1/")) {
        config.url = config.url.replace(/^\/api\//, "/api/v1/");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Recursive helper to normalize PascalCase keys to camelCase, snake_case, lowercase, and add necessary alias mappings
function normalizeKeys(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeKeys);
  }
  
  const normalized: any = {};
  for (const k of Object.keys(obj)) {
    // Recurse first to normalize nested objects/arrays
    const val = normalizeKeys(obj[k]);
    normalized[k] = val; // Keep the original key intact

    // Convert capitalized ID to Id for consistent camelCasing (e.g., UserID -> UserId)
    const normalizedKey = k.replace(/ID/g, "Id");
    
    // camelCase conversion
    const camel = normalizedKey.charAt(0).toLowerCase() + normalizedKey.slice(1);
    normalized[camel] = val;

    // snake_case conversion
    const snake = camel.replace(/([A-Z])/g, "_$1").toLowerCase();
    normalized[snake] = val;

    // lowercase conversion
    const lower = k.toLowerCase();
    normalized[lower] = val;

    // Map any key ending with "id" to a flat "id" property for general list mapping compatibility
    if (lower.endsWith("id")) {
      normalized["id"] = val;
    }

    // Explicit mappings to align different casing and wording on model properties
    if (lower === "accessprivilege" || lower === "accessprivilegename") {
      normalized["name"] = val;
      normalized["privilege"] = val;
      normalized["access_privilege"] = val;
    }
    if (lower === "fullname" || lower === "userfullname") {
      normalized["name"] = val;
      normalized["user_name"] = val;
      normalized["username"] = val;
      normalized["fullname"] = val;
    }
    if (lower === "client") {
      normalized["name"] = val;
      normalized["client_name"] = val;
    }
    if (lower === "contact") {
      normalized["name"] = val;
      normalized["contact_name"] = val;
    }
    if (lower === "course") {
      normalized["name"] = val;
      normalized["course_name"] = val;
    }
    if (lower === "coursetype") {
      normalized["name"] = val;
      normalized["course_type"] = val;
      normalized["course_type_name"] = val;
    }
    if (lower === "usertype") {
      normalized["type"] = val;
      normalized["user_type"] = val;
      normalized["usertype"] = val;
      normalized["name"] = val;
    }
    if (lower === "module") {
      normalized["name"] = val;
      normalized["module_name"] = val;
      normalized["module"] = val;
    }
    if (lower === "login") {
      normalized["loginid"] = val;
      normalized["login_id"] = val;
      normalized["loginId"] = val;
    }
    if (lower === "mobile") {
      normalized["mobile_number"] = val;
      normalized["phone"] = val;
    }
  }
  return normalized;
}

// Interceptor to unpack paginated backend responses (containing .items array) and normalize casing centrally
API.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object") {
      if (Array.isArray(response.data.items)) {
        response.data = normalizeKeys(response.data.items);
      } else {
        response.data = normalizeKeys(response.data);
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;