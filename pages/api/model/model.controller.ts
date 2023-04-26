import { NextApiRequest, NextApiResponse } from "next";
import model from "./model.model";

async function getModel(req: NextApiRequest, res: NextApiResponse) {
	// get model by id
	const { id } = req.query as { id: string | number };
	try {
		const currentModel = await model.findById(id).populate("brand");
		return res.status(200).json({ success: true, data: currentModel });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getModels(req: NextApiRequest, res: NextApiResponse) {
	// get all models
	try {
		const models = await model.find({}).populate("brand");
		return res.status(200).json({ success: true, data: models });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function createModel(req: NextApiRequest, res: NextApiResponse) {
	// create model
	try {
		const newModel = await model.create(req.body);
		return res.status(201).json({ success: true, data: newModel });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function updateModel(req: NextApiRequest, res: NextApiResponse) {
	// update model
	const { id } = req.query as { id: string | number };
	try {
		const updatedModel = await model.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		return res.status(200).json({ success: true, data: updatedModel });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function deleteModel(req: NextApiRequest, res: NextApiResponse) {
	// delete model
	const { id } = req.query as { id: string | number };
	try {
		const deletedModel = await model.deleteOne({ _id: id });
		return res.status(200).json({ success: true, data: deletedModel });
	} catch (err) {
		return res.status(400).json(err);
	}
}

export { getModel, getModels, createModel, updateModel, deleteModel };
