
// Iron state auth middleware
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

function authMiddleware(req: NextApiRequest, res: NextApiResponse, next: NextApiHandler) {
  // check authentication
  if (!req.session.user) {
    res.status(401).send({ error: "Not logged in" });
    return;
  }
  return next(req, res);
}

export default authMiddleware;
