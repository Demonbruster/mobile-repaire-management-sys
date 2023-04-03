import { url_path } from "../constants/apiPath";
import { IBrand } from "../constants/types";
import axios from "../lib/axios";

export const getBrands = async() => {
  return await axios
    .get(url_path.brand)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const getBrand = async(id: string) => {
  return await axios
    .get(`${url_path.brand}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const createBrand = async(data: IBrand) => {
  return await axios
    .post(url_path.brand, data)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}
