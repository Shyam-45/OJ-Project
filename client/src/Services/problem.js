import axios from 'axios'

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getProblemList = async () => {
    try {
        console.log('API for problem list called');
        const response = await axios.get(`${backend_url}/problem`);
        console.log(response.data.problemList);
        console.log('problem list api got the response');
        return (response.data.problemList);
    } catch(err) {
        console.log(`Error , ${err.message}`);
        // If there is issue fetching problem list
        return ([]);
    }
}

export const getProblemInfo = async (id) => {
    try {
        console.log(`API for problemID: ${id} called`);
        const response = await axios.get(`${backend_url}/problem/${id}`);
        console.log(response.data.problemInfo);
        console.log(`problemID: ${id} API got the response`);
        return (response.data.problemInfo);
    } catch(err) {
        console.log(`Error , ${err.message}`);
        // If there is issue fetching problem
        // return ();
    }
}