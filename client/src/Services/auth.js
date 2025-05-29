import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const checkLogin = async () => {
  try {
    const response = await axios.get(`${backend_url}/authlogin`, {
      withCredentials: true,
    });

    // if (!response.data.success) {
    //   // This case might never be applicable (based on backend response status)
    //   return { loggedIn: false };
    // }

    if (response.data.success) {
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
