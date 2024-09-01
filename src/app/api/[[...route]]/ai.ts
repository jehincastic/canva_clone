import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { verifyAuth } from "@hono/auth-js";

import { replicate } from "@/lib/replicate";

const app = new Hono()
	.post("/remove-bg",
		verifyAuth(),
		zValidator(
			"json",
			z.object({
				image: z.string().url(),
			}),
		),
		async (c) => {
			const { image } = c.req.valid("json");
			// const output = await replicate.run(
			// 	"cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
			// 	{ input: { image } },
			// );
			// const res = output as string;
			const res = "https://replicate.delivery/pbxt/2hczaMwD9xrsIR8h3Cl8iYGbHaCdFhIOMZ0LfoYfHlKuuIBQA/out.png";
			return c.json({ data: res });
		},
	)
	.post("/generate-image",
		verifyAuth(),
		zValidator(
			"json",
			z.object({
				prompt: z.string(),
			}),
		),
		async (c) => {
			const { prompt } = c.req.valid("json");
			// const output = await replicate.run(
			// 	"stability-ai/stable-diffusion-3",
			// 	{
			// 		input: {
			// 			cfg: 3.5,
			// 			steps: 28,
			// 			prompt,
			// 			aspect_ratio: "3:2",
			// 			output_format: "webp",
			// 			output_quality: 90,
			// 			negative_prompt: "",
			// 			prompt_strength: 0.85
			// 		},
			// 	},
			// );

			// const res = output as string[];
			const res = ["https://replicate.delivery/yhqm/i4mS31BVDBYVIF0ol6UV2dwHwuztMDbsnlVJBeJ75ViVTQhJA/R8_SD3_00001_.webp"];
			return c.json({ data: res[0] });
		},
	);

export default app;
