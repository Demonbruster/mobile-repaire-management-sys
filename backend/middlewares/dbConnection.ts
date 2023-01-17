// connection mongoose to mongodb is done in lib\database.ts
// if failed, it throws an error

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../lib/database";

async function databaseConnection(req: NextApiRequest, res: NextApiResponse, next: NextApiHandler) {
  // connection to db
  try {
    await connectDB();
    return next(req, res);
  } catch (err) {
    return res.status(400).json(err);
  }
}

export default databaseConnection;
