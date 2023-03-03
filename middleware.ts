// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";

const ENV = {
	cookieName: process.env.IRON_COOKIE_NAME || "myapp_cookiename",
	password: process.env.IRON_COOKIE_PASSWORD || "complex_password_at_least_32_characters_long",
};

export const middleware = async (req: NextRequest) => {
	const res = NextResponse.next();
	const session = await getIronSession(req, res, {
		...ENV,
		// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
		cookieOptions: {
			secure: process.env.NODE_ENV === "production",
		},
	});

	// do anything with session here:
	const { user } = session;

	//test

	// like mutate user:
	// user.something = someOtherThing;
	// or:
	// session.user = someoneElse;

	// uncomment next line to commit changes:
	// await session.save();
	// or maybe you want to destroy session:
	// await session.destroy();

	console.log("from middleware", { user });

	// demo:
	if (user?.admin !== true) {
		// unauthorized to see pages inside admin/
		return NextResponse.redirect(new URL("/", req.url)); // redirect to /unauthorized page
	}

	return res;
};

export const config = {
	matcher: "/admin/:path*",
};
