import { withIronSessionApiRoute } from "iron-session/next";
import {
	createCustomer,
	deleteCustomer,
	getCustomer,
	getCustomers,
	updateCustomer,
} from "../../backend/controller/customer";
import authMiddleware from "../../backend/middlewares/auth";
import databaseConnection from "../../backend/middlewares/dbConnection";
import { ironOptions } from "../../lib/config";

export default withIronSessionApiRoute(
	async function customerRoute(req, res) {
		return authMiddleware(req, res, async (req, res) => {
			databaseConnection(req, res, async (req, res) => {
				// request method
				const { method } = req;

				switch (method) {
					case "GET": {
						// if query has id then get customer by id else get all customers
						if (req.query.id) return await getCustomer(req, res);
						return await getCustomers(req, res);
					}
					case "POST":
						return await createCustomer(req, res);
					case "PUT":
						return await updateCustomer(req, res);
					case "DELETE":
						return await deleteCustomer(req, res);
					default:
						return res.status(400).json({ success: false });
				}
			});
		});
	},
	{ ...ironOptions }
);
