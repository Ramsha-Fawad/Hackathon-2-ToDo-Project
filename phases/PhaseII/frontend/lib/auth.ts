import { betterAuth } from "better-auth";

const auth = betterAuth({
  secret: process.env.AUTH_SECRET || "fallback-secret-change-this",
  trustHost: true,
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "./db.sqlite",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    // Add social providers here if needed in the future
  },
});

export default auth;