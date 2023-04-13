import { NextApiRequest, NextApiResponse } from "next";
import { defaultBrands } from "../../../constants/constant";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getBrands(req: NextApiRequest, res: NextApiResponse) {
	try {
		let brands = await prisma.brand.findMany();

		// if brads is empty create a default brands
		if (brands.length === 0) {
			// foreach default brand create a brand
			defaultBrands.forEach(async (brand) => {
				await prisma.brand.create({
					data: {
						name: brand,
					},
				});
			});

			// get all brands
			brands = await prisma.brand.findMany();
		}

		return res.status(200).json({ success: true, data: brands });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		const brandById = await prisma.brand.findUnique({
			where: {
				id: Number(id),
			},
		});
		return res.status(200).json({ success: true, data: brandById });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function createBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const newBrand = await prisma.brand.create({
			data: req.body,
		});
		return res.status(201).json({ success: true, data: newBrand });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function updateBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		const updatedBrand = await prisma.brand.update({
			where: {
				id: Number(id),
			},
			data: req.body,
		});
		return res.status(200).json({ success: true, data: updatedBrand });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function deleteBrand(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		await prisma.brand.delete({
			where: {
				id: Number(id),
			},
		});
		return res.status(200).json({ success: true, data: {} });
	} catch (err) {
		return res.status(400).json(err);
	}
}

export { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
