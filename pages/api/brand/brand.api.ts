import { NextApiRequest, NextApiResponse } from "next";
import { createBrand, deleteBrand, getBrand, getBrands, updateBrand } from "./brand.controller.prisma";

export const brandApi = async (req: NextApiRequest, res: NextApiResponse, withId: boolean) => {
	// request method
	const { method } = req;

	switch (method) {
		case "GET": {
			// if query has id then get brand by id else get all brands
			if (withId) return await getBrand(req, res);
			return await getBrands(req, res);
		}
		case "POST": {
			if (withId) return res.status(400).json({ success: false });
			return await createBrand(req, res);
		}
		case "PUT":
			return await updateBrand(req, res);
		case "DELETE":
			return await deleteBrand(req, res);
		default:
			return res.status(400).json({ success: false });
	}
};
