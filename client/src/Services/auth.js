import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const loginAuth = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/user/login`, data, {
      withCredentials: true,
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        error: response.data.error || "Login failed",
      };
    }
  } catch (err) {
    console.error("Error during login at api end: ", err.message);

    return {
      success: false,
      error: "Unable to login.",
    };
  }
};

export const registerAuth = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/user/register`, data, {
      withCredentials: true,
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        eror: response.data.error || "User registration failed",
      };
    }
  } catch (err) {
    console.error("Error during registration at api end: ", err.message);

    return {
      success: false,
      error: "Unable to register.",
    };
  }
};

export const checkLogin = async () => {
  try {
    const response = await axios.get(`${backend_url}/authlogin`, {
      withCredentials: true,
    });
    console.log(response);

    if (response.data.success) {
      return { loggedIn: true };
    }
  } catch (err) {
    if (err.response?.status === 401) {
      return { loggedIn: false, message: err.response.data.error };
    }
    // Unexpected errors
    console.error("Unexpected error checking login:", err);
    return { loggedIn: false, message: "Unknown error" };
  }
};

export const logoutUser = async () => {
  try {
    console.log("Logout request sent from frontend");
    const response = await axios.get(`${backend_url}/user/logout`, {
      withCredentials: true,
    });

    return {
      success: true,
      loggedIn: response.data.loggedIn,
      message: response.data.message || "User logged out successfully",
    };
  } catch (err) {
    console.error("Error while logging out:", err.message);
    return {
      success: false,
      message: "Failed to log out. Please try again.",
    };
  }
};
