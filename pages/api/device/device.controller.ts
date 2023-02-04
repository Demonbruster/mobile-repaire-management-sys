import { NextApiRequest, NextApiResponse } from "next";
import { IDevice, ICustomer } from "../../../constants/types";
import customerModel from "../customer/customer.model";
import deviceModel from "./device.model";

async function getDevices(req: NextApiRequest, res: NextApiResponse) {
	try {
		const devices = await deviceModel.find({});
		return res.status(200).json({ success: true, device: devices });
	} catch (err) {
		return res.status(400).json(err);
	}
}

async function getDevice(req: NextApiRequest, res: NextApiResponse) {
  try{
    const { id } = req.query as { id: string | number };
    const device = await deviceModel.findById(id.toString());
    return res.status(200).json({ success: true, device: device });
  } catch (err) {
    return res.status(400).json(err);
  }
}

async function createDevice(req: NextApiRequest, res: NextApiResponse) {
  // check customer id
  const { customerId } = req.body as { customerId: string | number };
  try{

    const customer = await customerModel.findById(customerId.toString());
    if (!customer) {
      return res.status(400).json({ success: false, message: "Customer not found" });
    }

    const newDevice = await deviceModel.create({
      ...req.body,
      customer: customer._id,
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
