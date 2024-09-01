import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_AUTH_TOKEN!,
	},
	verbose: true,
	strict: true,
});