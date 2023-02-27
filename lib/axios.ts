import axios from "axios";

const instance = axios.create({
  //current ui url
  // baseURL: window.location.origin,
  baseURL: "/api",
});

export default instance;
