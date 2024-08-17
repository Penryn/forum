import axios from "axios";

const request = (config :object) =>{
    const instance = axios.create({
        baseURL: '/api',
        timeout: 5000
    });
    return instance(config);
};

export default request;