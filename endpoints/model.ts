import { url_path } from "../constants/apiPath";
import axios from "../lib/axios";

export const getModels = async() => {
  return await axios
    .get(url_path.device)
    .then((res) => res.data)
    .catch((err) => err);
};
