// customer controller

import { NextApiRequest, NextApiResponse } from "next";
import customer from "../models/customer";

async function getCustomers(req: NextApiRequest, res: NextApiResponse) {
	try {
		const customers = await customer.find({});
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
    const customerById = await customer.findById(id.toString());
    return res.status(200).json({ success: true, data: customerById });
  } catch (err) {
    return res.status(400).json(err);
  }
}
 
async function createCustomer(req: NextApiRequest, res: NextApiResponse) {
	try {
		const newCustomer = await customer.create(req.body);
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
		const updatedCustomer = await customer.findByIdAndUpdate(id.toString(), req.body, {
			new: true,
			runValidators: true,
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
		await customer.findById(id.toString());
		return res.status(200).json({ success: true, data: {} });
	} catch (err) {
		return res.status(400).json(err);
	}
}

export { getCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomer };
