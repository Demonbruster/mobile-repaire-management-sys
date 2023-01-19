import { withIronSessionApiRoute } from "iron-session/next";
import authMiddleware from "../../../backend/middlewares/auth";
import databaseConnection from "../../../backend/middlewares/dbConnection";
import { ironOptions } from "../../../lib/config";
import { brandApi } from "./brand.api";

export default withIronSessionApiRoute(
	async function brandRoute(req, res) {
		return authMiddleware(req, res, async (req, res) => {
			databaseConnection(req, res, async (req, res) => {
				return brandApi(req, res, false);
			});
		});
	},
	{ ...ironOptions }
);
