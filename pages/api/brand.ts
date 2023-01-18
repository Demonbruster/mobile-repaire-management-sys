import { withIronSessionApiRoute } from "iron-session/next";
import { createBrand, deleteBrand, getBrand, getBrands, updateBrand } from "../../backend/controller/brand";
import authMiddleware from "../../backend/middlewares/auth";
import databaseConnection from "../../backend/middlewares/dbConnection";
import { ironOptions } from "../../lib/config";

export default withIronSessionApiRoute(
	async function brandRoute(req, res) {
		return authMiddleware(req, res, async (req, res) => {
			databaseConnection(req, res, async (req, res) => {
				// request method
				const { method } = req;

				switch (method) {
					case "GET": {
						// if query has id then get brand by id else get all brands
						if (req.query.id) return await getBrand(req, res);
						return await getBrands(req, res);
					}
					case "POST":
						return await createBrand(req, res);
					case "PUT":
						return await updateBrand(req, res);
					case "DELETE":
						return await deleteBrand(req, res);
					default:
						return res.status(400).json({ success: false });
				}
			});
		});
	},
	{ ...ironOptions }
);
