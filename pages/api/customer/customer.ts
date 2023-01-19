import { withIronSessionApiRoute } from "iron-session/next";
import authMiddleware from "../../../backend/middlewares/auth";
import databaseConnection from "../../../backend/middlewares/dbConnection";
import { ironOptions } from "../../../lib/config";
import { customerApi } from "./customer.api";

export default withIronSessionApiRoute(
	async function customerRoute(req, res) {
		return authMiddleware(req, res, async (req, res) => {
			databaseConnection(req, res, async (req, res) => {
				return customerApi(req, res, false);
			});
		});
	},
	{ ...ironOptions }
);
