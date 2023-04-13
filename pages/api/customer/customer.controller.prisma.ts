// customer controller

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCustomers(req: NextApiRequest, res: NextApiResponse) {
	try {
		const customers = await prisma.customer.findMany();
		return res.status(200).json({ success: true, data: customers });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getCustomer(req: NextApiRequest, res: NextApiResponse) {
	// get id from query
	// get body from request
	const { id } = req.query as { id: string | number };

	try {
		const customerById = await prisma.customer.findUnique({
			where: {
				id: Number(id),
			},
		});
		return res.status(200).json({ success: true, data: customerById });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function createCustomer(req: NextApiRequest, res: NextApiResponse) {
	try {
		const newCustomer = await prisma.customer.create({
			data: req.body,
		});
		return res.status(201).json({ success: true, data: newCustomer });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function updateCustomer(req: NextApiRequest, res: NextApiResponse) {
	// get id from query
	// get body from request
	const { id } = req.query as { id: string | number };

	try {
		const updatedCustomer = await prisma.customer.update({
			where: {
				id: Number(id),
			},
			data: req.body,
		});
		return res.status(200).json({ success: true, data: updatedCustomer });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function deleteCustomer(req: NextApiRequest, res: NextApiResponse) {
	// get id from query
	// get body from request
	const { id } = req.query as { id: string | number };

	try {
		await prisma.customer.delete({
			where: {
				id: Number(id),
			},
		});
		return res.status(200).json({ success: true, data: {} });
	} catch (err) {
		return res.status(400).json(err);
	}
}

export { getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomer };
