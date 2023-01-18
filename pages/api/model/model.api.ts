import { NextApiRequest, NextApiResponse } from "next";
import { createModel, deleteModel, getModel, getModels, updateModel } from "./model.controller";

export const modelApi = async (req: NextApiRequest, res: NextApiResponse, withId: boolean) => {
	// request method
	const { method } = req;

	switch (method) {
		case "GET": {
			// if query has id then get model by id else get all models
			if (withId) return await getModel(req, res);
			return await getModels(req, res);
		}
		case "POST": {
			if (withId) return res.status(400).json({ success: false });
			return await createModel(req, res);
		}
		case "PUT":
			return await updateModel(req, res);
		case "DELETE":
			return await deleteModel(req, res);
		default:
			return res.status(400).json({ success: false });
	}
};
