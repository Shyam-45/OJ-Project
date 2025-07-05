import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const checkLogin = async () => {
  try {
    const response = await axios.get(`${backend_url}/authlogin`, {
      withCredentials: true,
    });

    if (response.data.success) {
      return { loggedIn: true, user_id: response.data.userid };
    }
  } catch (err) {
    if (err.response?.status === 401) {
      // console.log(`${err.response.data.error}`);
      return { loggedIn: false };
    }
    // Unexpected errors
    // console.error("Unexpected error checking login status through API:", err);
    return { loggedIn: false };
  }
};
