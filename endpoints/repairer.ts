import { url_path } from "../constants/apiPath";
import axios from "../lib/axios";

export interface IRepairer_FE {
	customer: string;
	device: string;
	charge: string;
	problem: string;
	notes: string;
	entryDate: Date;
	expectedDeliveryDate: Date;
}

export const getRepairers = async () =>
	axios
		.get(url_path.repairer)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});

export const getRepairer = async (id: string) =>
	axios
		.get(`${url_path.repairer}/${id}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});

export const createRepairer = async (data: IRepairer_FE) =>
	axios
		.post(url_path.repairer, data)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});

export const updateRepairer = async (id: string, data: IRepairer_FE) =>
	axios
		.put(`${url_path.repairer}/${id}`, data)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});

export const deleteRepairer = async (id: string) =>
	axios
		.delete(`${url_path.repairer}/${id}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
