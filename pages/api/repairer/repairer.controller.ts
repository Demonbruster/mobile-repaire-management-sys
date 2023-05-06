import { NextApiRequest, NextApiResponse } from "next";
import customerModel from "../customer/customer.model";
import deviceModel from "../device/device.model";
import repairerModel from "./repairer.model";

async function getRepairers(req: NextApiRequest, res: NextApiResponse) {
	try {
		const repairers = await repairerModel.find({}).populate("customer").populate("device");
		return res.status(200).json({ success: true, repairers: repairers });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getRepairerById(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		// split by '/' and get 1st element if the 1st element is customer then get by customer id
		// else if it customerPhone then get by customer phone else if it is device then get by device id

		const firstElement = id.toString().split("/")[0].toLowerCase();

		if (firstElement === "customer") {
			return getRepairerByCustomerId(req, res, id.toString().split("/")[1]);
		} else if (firstElement === "customerphone") {
			return getRepairerByCustomerPhone(req, res, id.toString().split("/")[1]);
		} else if (firstElement === "device") {
			return getRepairerByDeviceId(req, res, id.toString().split("/")[1]);
		}

		const repairer = await repairerModel.findById(id.toString()).populate("customer").populate("device");
		return res.status(200).json({ success: true, repairer: repairer });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getRepairerByCustomerId(req: NextApiRequest, res: NextApiResponse, customerId: string) {
	try {
		const repairer = await repairerModel.find({ customer: customerId.toString() });
		return res.status(200).json({ success: true, repairer: repairer });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getRepairerByCustomerPhone(req: NextApiRequest, res: NextApiResponse, customerPhone: string) {
	try {
		const customer = await customerModel.findOne({ phone: customerPhone.toString() });
		if (!customer) {
			return res.status(400).json({ success: false, message: "Customer not found" });
		}
		const repairer = await repairerModel.find({ customer: customer._id });
		return res.status(200).json({ success: true, repairer: repairer });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getRepairerByDeviceId(req: NextApiRequest, res: NextApiResponse, deviceId: string) {
	try {
		const repairer = await repairerModel.find({ device: deviceId.toString() });
		return res.status(200).json({ success: true, repairer: repairer });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function createRepairer(req: NextApiRequest, res: NextApiResponse) {
	try {
		// check device id
		const { device:deviceId } = req.body as { device: string | number };
		const device = await deviceModel.findById(deviceId.toString()).populate("owner");
		if (!device) {
			return res.status(400).json({ success: false, message: "Device not found" });
		}

		const newRepairer = await repairerModel.create({
			customer: req.body.customer,
			status: 'pending',
			charge: req.body.charge,
			problem: req.body.problem,
			notes: req.body.notes,
			entryDate: req.body.entryDate,
			expectedDeliveryDate: req.body.expectedDeliveryDate,
			device: device._id,
		});

		return res.status(201).json({ success: true, repairer: newRepairer });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function updateRepairer(req: NextApiRequest, res: NextApiResponse) {
	// currently not implemented please delete the record and create a new one
	return res
		.status(400)
		.json({ success: false, message: "Currently not implemented please delete the record and create a new one" });
}

async function deleteRepairer(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };

		await repairerModel.findByIdAndDelete(id.toString());
		return res.status(200).json({ success: true });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function softDeleteRepairer(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };

		const repairer = await repairerModel.findById(id.toString());
		if (!repairer) {
			return res.status(400).json({ success: false, message: "Repairer not found" });
		}

		repairer.isDeleted = true;
		await repairer.save();

		return res.status(200).json({ success: true });
	} catch (err) {
		return res.status(400).json(err);
	}
}

export {
	getRepairers,
	getRepairerById,
	getRepairerByCustomerId,
	getRepairerByCustomerPhone,
	getRepairerByDeviceId,
	createRepairer,
	updateRepairer,
	deleteRepairer,
	softDeleteRepairer,
};
