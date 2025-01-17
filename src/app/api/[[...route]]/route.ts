import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import { AuthConfig, initAuthConfig } from "@hono/auth-js";

import ai from "./ai";
import images from "./images";
import authConfig from "@/auth.config";

// Revert to "edge" if deploying on vercel
export const runtime = "nodejs";

const getAuthConfig = (c: Context): AuthConfig => {
	return {
		secret: c.env.AUTH_SECRET,
		...authConfig,
	};
};

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
	.route("/ai", ai)
	.route("/images", images);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
