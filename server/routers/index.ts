import {
    createCallerFactory,
    createTRPCRouter,
    publicProcedure,
} from "@/server/trpc";
import { z } from "zod";
import { spotifyRouter } from "@/server/api/spotify";
import { githubRouter } from "@/server/api/github";

export const appRouter = createTRPCRouter({
    hello: publicProcedure
        .input(
            z.object({
                text: z.string(),
            })
        )
        .query((opts) => {
            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
    spotify: spotifyRouter,
    github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
