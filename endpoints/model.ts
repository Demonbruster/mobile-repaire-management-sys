import { url_path } from "../constants/apiPath";
import axios from "../lib/axios";

export interface IModel_FE {
  name: string;
  brand: string;
}

export const getModels = async() => {
  return await axios
    .get(url_path.model)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
};

export const getModel = async(id: string) => {
  return await axios
    .get(`${url_path.model}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const createModel = async(data: IModel_FE) => {
  return await axios
    .post(url_path.model, data)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const updateModel = async(id: string, data: IModel_FE) => {
  return await axios
    .put(`${url_path.model}/${id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const deleteModel = async(id: string) => {
  return await axios
    .delete(`${url_path.model}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}
