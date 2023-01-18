import axios from "axios";

const instance = axios.create({
  //current ui url
  // baseURL: window.location.origin,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export default instance;
