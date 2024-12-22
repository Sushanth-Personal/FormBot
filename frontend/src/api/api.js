import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure you're using the correct import here

// const baseURL = "http://localhost:5000";
const baseURL = "https://formbot-backend-scps.onrender.com";

const api = axios.create({
  baseURL: `${baseURL}`,
});

api.interceptors.request.use((config) => {
  if (config.url.includes("/protected")) {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken Checking", accessToken);
    if (!accessToken) { 
      window.location.href = "/login";
      return Promise.reject("No access token found");
    }

    try {
      const decodedAccessToken = jwtDecode(accessToken);
      const accessTokenExpiryTime =
        decodedAccessToken.exp * 1000 - Date.now();

      if (accessTokenExpiryTime <= 0) {
        // Token expired
        console.warn("Access token expired. Redirecting to login...");
        window.location.href = "/login";
        return Promise.reject("Access token expired");
      }

      // Attach valid token to request
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      return config;
    } catch (error) {
      console.error("Failed to decode token:", error);
      window.location.href = "/login";
      return Promise.reject(error);
    }
  } else return config;
});

// Interceptor for handling wrong access token
api.interceptors.response.use(
  (response) => {
    // Check if the response has the access token
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        // Decode the access token to extract userId
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.id; // Replace with the actual key in the decoded token
        // Store the userId (e.g., in localStorage or state)
        localStorage.setItem("userId", userId); // Or use any other method for storage
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      console.warn(
        "Unauthorized or forbidden response. Redirecting to login..."
      );
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const checkAuthentication = async () => {
  try {
    const response = await api.get("/protected/");
    console.log("checkAuthentication", response);
    return response.data;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const loginUser = async (email, password) => {
  console.log(email, password);
  // Check if identifier and password are provided
  if (!email || !password) {
    console.error("Identifier and password are required");
    return { message: "Identifier and password are required" };
  }

  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
    });
    console.log(response.data);
    const { user, accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);

    return { message: "Success", user, accessToken };
  } catch (error) {
    console.error(
      "Error logging in:",
      error.response?.data || error.message
    );
    
    return error.response?.data.message || "Login failed" ;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    console.log(username, email, password);
    const response = await axios.post(`${baseURL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data.message; //
    //  Return the data directly
  } catch (error) {
    console.error("Error registering:", error.response.data.message);

    return error.response.data.message; // Handle error by returning null or an empty array
  }
};

export const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/protected/user/${userId}`);
    console.log("fetchUserresponse", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
