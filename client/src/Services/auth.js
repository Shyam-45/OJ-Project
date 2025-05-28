import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const loginAuth = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/user/login`, data, {
      withCredentials: true,
    });

    if (!response.data.success) {
      console.log(response.data.error);
      return {
        success: false,
        error: response.data.error,
      };
    }
    return {
      success: true,
      message: response.data.message,
      user_id: response.data.userId,
    };
  } catch (err) {
    if (err.response.status === 401) {
      console.error(err.response.data.error);
      return {
        success: false,
        error: err.response.data.error,
      };
    }

    if (err.response.status === 500) {
      console.log(`Internal server error`);
    }

    // Error during login at api endpoint
    console.log(err);
    return {
      success: false,
      error: "Login failed",
    };
  }
};

export const registerAuth = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/user/register`, data, {
      withCredentials: true,
    });

    if (!response.data.success) {
      return {
        success: false,
        eror: response.data.error,
      };
    }
    return {
      success: true,
      message: response.data.message,
      user_id: response.data.userId,
    };
  } catch (err) {
    if (err.response.status === 401 || err.response.status === 409) {
      console.error(err.response.data.error);
      return {
        success: false,
        error: err.response.data.error,
      };
    }

    if (err.response.status === 500) {
      console.log(`Internal server error`);
    }

    // Error during singup at api endpoint
    console.log(err);
    return {
      success: false,
      error: "Account registration failed",
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
      // console.log("ereir  jjjn");
      return { loggedIn: true, user_id: response.data.userid };
    }
  } catch (err) {
    if (err.response?.status === 401) {
      // Error from backend while checking login status
      console.log(`${err.response.data.error}`);
      return { loggedIn: false };
    }
    // Unexpected errors
    console.error("Unexpected error checking login status through API:", err);
    return { loggedIn: false };
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
