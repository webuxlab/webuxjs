import axios from "axios";

let http = null;

http = axios.create({
  baseURL: process.env.API_URL || "http://127.0.0.1:1339/"
});

export default http;
