import axios from "../lib/axios";
import { url_path } from "../constants/apiPath";

export interface ICustomer_FE {
  name: string;
  phone: string;
}

export const getCustomers = async () => {
  return await axios
    .get(url_path.customer)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const getCustomer = async (id: string) => {
  return await axios
    .get(`${url_path.customer}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const createCustomer = async (data: ICustomer_FE) => {
  return await axios
    .post(url_path.customer, data)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const updateCustomer = async (id: string, data: ICustomer_FE) => {
  return await axios
    .put(`${url_path.customer}/${id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}

export const deleteCustomer = async (id: string) => {
  return await axios
    .delete(`${url_path.customer}/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
}
