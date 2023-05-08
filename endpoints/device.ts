import { url_path } from "../constants/apiPath";
import axios from "../lib/axios";

export interface IDevice_FE {
	name: string;
	modelId: string;
	imei: string;
	color: string;
	customerId: string;
}

export const getDevices = async () => {
	return await axios
		.get(url_path.device)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
};

export const getDevice = async (id: string) => {
	return await axios
		.get(`${url_path.device}/${id}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
};

export const createDevice = async (data: IDevice_FE) => {
	return await axios
		.post(url_path.device, data)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
};

export const updateDevice = async (id: string, data: IDevice_FE) => {
	return await axios
		.put(`${url_path.device}/${id}`, data)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
};

export const deleteDevice = async (id: string) => {
	return await axios
		.delete(`${url_path.device}/${id}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
};
