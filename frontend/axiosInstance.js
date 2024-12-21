import axios from "axios";
import settings from "./settings";

const instance = axios.create({
  baseURL: settings.baseURL,
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export default instance;
