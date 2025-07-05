import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const loginAuth = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/user/login`, data, {
      withCredentials: true,
    });

    if (!response.data.success) {
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
      // console.error(err.response.data.error);
      return {
        success: false,
        error: err.response.data.error,
      };
    }

    if (err.response.status === 500) {
      console.log(`Internal server error`);
    }

    // console.log(err);
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

    return {
      success: true,
      message: response.data.message,
      user_id: response.data.userId,
    };
  } catch (err) {
    if (err.response.status === 401 || err.response.status === 409) {
      // console.error(err.response.data.error);
      return {
        success: false,
        error: err.response.data.error,
      };
    }

    if (err.response.status === 500) {
      console.log(`Internal server error`);
    }

    // Error during singup at api endpoint
    // console.log(err);
    return {
      success: false,
      error: "Account registration failed",
    };
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.get(`${backend_url}/user/logout`, {
      withCredentials: true,
    });

    return {
      success: true,
    };
  } catch (err) {
    // console.error("Error while logging out:", err);
    return {
      success: false,
      error: "Failed to log out. Please try again.",
    };
  }
};

export const getUserInfo = async (user_id) => {
  try {
    const response = await axios.get(`${backend_url}/user/${user_id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    if (
      err.response.status === 403 ||
      err.response.status === 404 ||
      err.response.status === 500
    ) {
      return err.response.data;
    }

    // console.log(err);
    return { success: false, error: "Something went wrong" };
  }
};

export const getUserProblem = async (user_id) => {
  try {
    const response = await axios.get(`${backend_url}/user/${user_id}/problem`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    if (err.response.status === 403 || err.response.status === 404) {
      return err.response.data;
    }

    // console.log(err);
    return { success: false, error: "Something went wrong" };
  }
};
