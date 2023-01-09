import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";

const user = {
  id: 1,
  admin: true,
  username: process.env.USER || "tobbymarchal@gmail.com",
  password: process.env.PASSWORD || "password",
}

export default withIronSessionApiRoute(
	async function loginRoute(req, res) {
    // only allow POST requests
    if(req.method !== "POST") {
      res.status(405).send({ error: "Method not allowed" });
      return;
    }

    if(req.body.email !== user.username || req.body.password !== user.password) {
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }
      
		req.session.user = {
			id: 1,
			admin: true,
      username: user.username,
		};

		await req.session.save();
		res.redirect('/dashboard')
	},
	{ ...ironOptions }
);
