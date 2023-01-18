import { NextApiRequest, NextApiResponse } from "next";
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from "./customer.controler";

export const customerApi = async (req: NextApiRequest, res: NextApiResponse, withId: boolean) => {
	// request method
	const { method } = req;

	switch (method) {
		case "GET": {
			// if query has id then get customer by id else get all customers
			if (withId) return await getCustomer(req, res);
			return await getCustomers(req, res);
		}
		case "POST": {
			if (withId) return res.status(400).json({ success: false });
			return await createCustomer(req, res);
		}
		case "PUT":
			return await updateCustomer(req, res);
		case "DELETE":
			return await deleteCustomer(req, res);
		default:
			return res.status(400).json({ success: false });
	}
};
