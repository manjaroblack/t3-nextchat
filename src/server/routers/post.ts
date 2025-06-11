import { publicProcedure, router } from "../trpc";

export const postRouter = router({
	hello: publicProcedure.query(() => {
		return "hello world";
	}),
});
