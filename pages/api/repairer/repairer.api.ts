import { NextApiRequest, NextApiResponse } from "next";
import {
	createRepairer,
	softDeleteRepairer,
	getRepairerById,
	getRepairers,
	updateRepairer,
	getRepairerByCustomerPhone,
} from "./repairer.controller";

export const repairerApi = async (req: NextApiRequest, res: NextApiResponse, withId: boolean) => {
	// request method
	const { method } = req;

	switch (method) {
		case "GET": {
			// query params	customerphone then getRepairerByCustomerPhone
			const { customerphone } = req.query as { customerphone: string };
			if (customerphone) return await getRepairerByCustomerPhone(req, res, customerphone);

			if (withId) return await getRepairerById(req, res);
			return await getRepairers(req, res);


		}
		case "POST": {
			if (withId) return res.status(400).json({ success: false });
			return await createRepairer(req, res);
		}
		case "PUT":
			return await updateRepairer(req, res);
		case "DELETE":
			return await softDeleteRepairer(req, res);
		default:
			return res.status(400).json({ success: false });
	}
};
