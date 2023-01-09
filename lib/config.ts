export const ironOptions = {
  cookieName: process.env.IRON_COOKIE_NAME || "session",
  password: process.env.IRON_COOKIE_PASSWORD || "password",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};