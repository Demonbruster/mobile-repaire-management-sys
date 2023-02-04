import { NextApiRequest, NextApiResponse } from "next";
import { createDevice, deleteDevice, getDevice, getDevices, updateDevice } from "./device.controller";

export const deviceApi = async (req: NextApiRequest, res: NextApiResponse, withId: boolean) => {
  // request method
  const { method } = req;

  switch (method) {
    case "GET": {
      // if query has id then get device by id else get all devices
      if (withId) return await getDevice(req, res);
      return await getDevices(req, res);
    }
    case "POST": {
      if (withId) return res.status(400).json({ success: false });
      return await createDevice(req, res);
    }
    case "PUT":
      return await updateDevice(req, res);
    case "DELETE":
      return await deleteDevice(req, res);
    default:
      return res.status(400).json({ success: false });
  }
};
