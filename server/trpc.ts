import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/db";
import redis from "@/db/redis";
import {
    githubMiddleware,
    spotifyMiddleware,
    timingMiddleware,
} from "@/server/middleware";

export const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        db,
        redis,
        ...opts,
    };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(timingMiddleware);
export const spotifyProcedure = publicProcedure.use(spotifyMiddleware);
export const githubProcedure = publicProcedure.use(githubMiddleware);
