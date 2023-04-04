import { NextApiRequest, NextApiResponse } from "next";
import { IDevice_FE } from "../../../endpoints/device";
import customerModel from "../customer/customer.model";
import deviceModel from "./device.model";

async function getDevices(res: NextApiResponse) {
	try {
		const devices = await deviceModel.find({});
		return res.status(200).json({ success: true, device: devices });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getDevice(req: NextApiRequest, res: NextApiResponse) {
	try {
		const { id } = req.query as { id: string | number };
		const device = await deviceModel.findById(id.toString());
		return res.status(200).json({ success: true, device: device });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function createDevice(req: NextApiRequest, res: NextApiResponse) {
	// check customer id
	const { owner, model, color, imei, name } = req.body as IDevice_FE;
	try {
		const customer = owner === "" ? null : await customerModel.findById(owner.toString());
		let newCustomer: any = null;
		if (!customer) {
			const unknownCustomer = await customerModel.findOne({ name: "Unknown" });
			if (unknownCustomer) newCustomer = unknownCustomer;
			else {
				// create customer if not found as unknown customer and return device
				newCustomer = await customerModel.create({
					name: "Unknown",
					phone: "Unknown",
				});
			}
		}

		const newDevice = await deviceModel.create({
			name,
			color,
			imei,
			model: model === "" ? null : model,
			customer: customer ? customer._id : newCustomer?._id,
		});

		return res.status(201).json({ success: true, device: newDevice });
	} catch (err) {
		return res.status(400).json(err);
	}
}

// update device details only
async function updateDevice(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query as { id: string | number };

	try {
		const updatedDevice = await deviceModel.findByIdAndUpdate(id.toString(), req.body, {
			new: true,
			runValidators: true,
		});

		return res.status(200).json({ success: true, device: updatedDevice });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function deleteDevice(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query as { id: string | number };

	try {
		await deviceModel.findByIdAndDelete(id.toString());
		return res.status(200).json({ success: true, device: {} });
	} catch (err) {
		return res.status(400).json(err);
	}
}

// soft delete device
async function softDeleteDevice(req: NextApiRequest, res: NextApiResponse) {
	const { id } = req.query as { id: string | number };

	try {
		const device = await deviceModel.findById(id.toString());
		if (!device) {
			return res.status(400).json({ success: false, message: "Device not found" });
		}

		device.isDeleted = true;
		await device.save();

		return res.status(200).json({ success: true, device: device });
	} catch (err) {
		return res.status(400).json(err);
	}
}

export { getDevices, getDevice, createDevice, updateDevice, deleteDevice, softDeleteDevice };
