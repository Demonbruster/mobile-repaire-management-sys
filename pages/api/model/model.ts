import { withIronSessionApiRoute } from "iron-session/next";
import authMiddleware from "../../../backend/middlewares/auth";
import databaseConnection from "../../../backend/middlewares/dbConnection";
import { ironOptions } from "../../../lib/config";
import { modelApi } from "./model.api";

export default withIronSessionApiRoute(
	async function modelRoute(req, res) {
		return authMiddleware(req, res, async (req, res) => {
			databaseConnection(req, res, async (req, res) => {
				return modelApi(req, res, false);
			});
		});
	},
	{ ...ironOptions }
);
