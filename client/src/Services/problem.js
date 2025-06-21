import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getProblemList = async () => {
  try {
    console.log("API for problem list called");
    const response = await axios.get(`${backend_url}/problem`, {
      withCredentials: true,
    });

    // if (!response.data.success) {
    //   // This case might never be applicable (based on backend response status)
    //   return {
    //     success: false,
    //     eror: response.data.error,
    //   };
    // }

    return { success: true, problem_list: response.data.problemList };
  } catch (err) {
    if (err.response.status === 500) {
      return err.response.data;
    }

    // If there is unexpected error
    console.log(`Error , ${err.message}`);

    return { success: false, error: "Problem list not found" };
  }
};

export const getProblemInfo = async (id) => {
  try {
    const response = await axios.get(`${backend_url}/problem/${id}`, {
      withCredentials: true,
    });
    // Avoiding redundant checks
    return { success: true, problemInfo: response.data.problemInfo };
  } catch (err) {
    console.log(`Error , ${err.message}`);
    if (err.response.status === 404) {
      return err.response.data;
    }
    return { success: false, error: "Something went wrong" };
  }
};

export const getCustomOutput = async (data) => {
  try {
    const response = await axios.post(
      `${backend_url}/problem/customrun`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 400) {
      return { success: false, error: err.response.data.error };
    }
    return { success: false, error: "something went wrong" };
  }
};

export const getOutput = async (id, data) => {
  try {
    const response = await axios.post(
      `${backend_url}/problem/${id}/run`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 400) {
      return { success: false, error: err.response.data.error };
    }
    return { success: false, error: "something went wrong" };
  }
};

export const getVerdict = async (id, data) => {
  try {
    const response = await axios.post(
      `${backend_url}/problem/${id}/submit`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    if (err.response.status === 400) {
      return { success: false, error: err.response.data.error };
    }
    return { success: false, error: "something went wrong" };
  }
};

export const sendNewProblem = async (data) => {
  try {
    const response = await axios.post(`${backend_url}/problem/new`, data, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(
      "NewProblm API encountered issue while interacting with backend"
    );
    return {
      success: false,
      error: "NewProblm API encountered issue while interacting with backend",
    };
  }
};

export const deleteProblem = async (p_id, u_id) => {
  try {
    console.log(u_id);
        console.log(p_id);
    const response = await axios.delete(
      `${backend_url}/problem/${p_id}/${u_id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const getProblemAndTestcases = async (p_id) => {
  try {
    // console.log("req send");
    // console.log(p_id);
    const response = await axios.get(`${backend_url}/problem/${p_id}/view`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(`Error , ${err.message}`);
    if (err.response.status === 404) {
      return err.response.data;
    }
    return { success: false, error: "Something went wrong" };
  }
};
