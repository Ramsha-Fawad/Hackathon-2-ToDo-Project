import { createAuth } from "better-auth";

const auth = createAuth({
  secret: process.env.AUTH_SECRET || "fallback-secret-change-this",
  trustHost: true,
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "./db.sqlite",
  },
  socialProviders: {
    // Add social providers here if needed in the future
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  advanced: {
    generateUserId: () => crypto.randomUUID(),
  },
});

export default auth;