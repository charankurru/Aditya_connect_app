import axios from "axios";
import { REACT_APP_API_KEY } from '@env'
// const API = "https://ac-backend2.herokuapp.com"
// const API = REACT_APP_API_KEY;
// const API = "http://10.0.2.2:3500"
// const API = "http://localhost:3500"
const API = "http://Adityaconnectbackend-env.eba-v5evckwp.ap-south-1.elasticbeanstalk.com"
const api = axios.create({
    baseURL: `${API}`,
    headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        //"x-access-token": localStorage.getItem("token"),
    },
});

export default api;
