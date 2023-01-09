import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";

export default withIronSessionApiRoute(
  function meRoute(req, res) {
    res.send({ user: req.session.user });
  },
  {...ironOptions}
);