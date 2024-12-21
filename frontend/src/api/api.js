import axios from "axios";
import jwtDecode from "jwt-decode";

// Base URL from environment variables
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create Axios instance
const api = axios.create({
  baseURL: `${baseURL}`,
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor
api.interceptors.request.use((config) => {
  if (config.url.includes("/protected")) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = "/login";
      return Promise.reject("No access token found");
    }

    try {
      const decodedAccessToken = jwtDecode(accessToken);
      if (decodedAccessToken.exp * 1000 <= Date.now()) {
        window.location.href = "/login";
        return Promise.reject("Access token expired");
      }

      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error("Error decoding token:", error);
      window.location.href = "/login";
      return Promise.reject(error);
    }
  }
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        localStorage.setItem("userId", decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const checkAuthentication = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    window.location.href = "/login";
    return false;
  }

  try {
    const response = await api.get("/protected/");
    return response.data;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const loginUser = async (email, password) => {
  if (!email || !password) return { message: "Email and password are required" };

  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("accessToken", response.data.accessToken);
    return { message: "Success", ...response.data };
  } catch (error) {
    return { message: error.response?.data?.message || "Login failed" };
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data.message;
  } catch (error) {
    return { message: error.response?.data?.message || "Registration failed" };
  }
};

export const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/protected/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};