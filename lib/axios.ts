import axios from "axios";

const instance = axios.create({
  //current ui url
  // baseURL: window.location.origin,
  baseURL: "http://localhost:3000",
});

export default instance;
