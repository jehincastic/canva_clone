import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

const useGetImages = () => {
	const query = useQuery({
		queryKey: ["images"],
		queryFn: async () => {
			const resp = await client.api.images.$get();
			if (!resp.ok) {
				throw new Error("Failed to fetch images");
			}

			const { data } = await resp.json();
			return data;
		},
	});

	return query;
};

export { useGetImages };
