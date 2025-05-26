import axios from "axios";

const api = axios.create({
  baseURL: "https://test-fe.mysellerpintar.com/api",
  timeout: 5000,
});

export default api;
