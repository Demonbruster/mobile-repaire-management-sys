import { NextApiRequest, NextApiResponse } from "next";
import brand from "./brand.model";

async function getBrands(req: NextApiRequest, res: NextApiResponse) {
	try {
		const brands = await brand.find({});
		return res.status(200).json({ success: true, data: brands });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		const brandById = await brand.findById(id.toString);
		return res.status(200).json({ success: true, data: brandById });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function createBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const newBrand = await brand.create(req.body);
		return res.status(201).json({ success: true, data: newBrand });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function updateBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		const updatedBrand = await brand.findByIdAndUpdate(id.toString(), req.body, {
			new: true,
			runValidators: true,
		});
		return res.status(200).json({ success: true, data: updatedBrand });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function deleteBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		await brand.findByIdAndDelete(id.toString());
		return res.status(200).json({ success: true, data: {} });
	} catch (err) {
		return res.status(400).json(err);
	}
}

export { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
