import axios from 'axios'

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const loginAuth = async (data) => {
    try {
        const response = await axios.post(`${backend_url}/users/login`, data);
        return(response.data);
    } catch(err) {
        console.log(`Error doing login authentication, ${err.message}`);
    }
}

export const registerAuth = async (data) => {
    try {
        const response = await axios.post(`${backend_url}/users/register`, data);
        return(response.data);
    } catch(err) {
        console.log(`Error doing login authentication, ${err.message}`);
    }
}