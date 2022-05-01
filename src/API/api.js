import axios from "axios";
import { REACT_APP_API_KEY } from '@env'
const API = "https://ac-backendtestbeta.herokuapp.com"
// const API = REACT_APP_API_KEY;
const api = axios.create({
    baseURL: `${API}`,
    headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        //"x-access-token": localStorage.getItem("token"),
    },
});

export default api;
