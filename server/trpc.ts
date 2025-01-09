import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/db";
import redis from "@/db/redis";
import { SPOTIFY_REFRESH_TOKEN, SPOTIFY_TOKEN } from "@/db/redis/keys";
import {
    getSpotifyToken,
    getSpotifyTokenFromRefresh,
} from "@/server/api/spotify/auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const ip = opts.headers.get("x-forwarded-for");
    return {
        db,
        redis,
        ip,
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

//Middleware
const timingMiddleware = t.middleware(async ({ next, path }) => {
    const start = Date.now();
    if (t._config.isDev)
        await new Promise((resolve) =>
            setTimeout(resolve, Math.floor(Math.random() * 400) + 100)
        );

    const result = await next();
    console.log(`[TRPC] ${path} took ${Date.now() - start}ms to execute`);
    return result;
});

const spotifyMiddleware = t.middleware(async ({ ctx, next }) => {
    const tokenExists = await ctx.redis.exists(SPOTIFY_TOKEN);
    if (tokenExists) return await next();
    // const spotifyRefreshToken = await ctx.redis.get<string>(
    //     SPOTIFY_REFRESH_TOKEN
    // );
    // if (spotifyRefreshToken) {
    //     await getSpotifyTokenFromRefresh(spotifyRefreshToken)
    //         .then(({ access_token, expires_in, refresh_token }) => {
    //             console.log(access_token);
    //             console.log(refresh_token);
    //             ctx.redis.set(SPOTIFY_TOKEN, access_token, {
    //                 ex: expires_in,
    //             });
    //             ctx.redis.set(SPOTIFY_REFRESH_TOKEN, refresh_token);
    //         })
    //         .then(() => console.log("Successfully set spotify token"));
    //     return await next();
    // }
    await getSpotifyToken()
        .then(({ access_token, expires_in }) =>
            ctx.redis.set(SPOTIFY_TOKEN, access_token, {
                ex: expires_in,
            })
        )
        .then(() => console.log("Successfully set spotify token"));

    return await next();
});

const githubMiddleware = t.middleware(async ({ ctx, next }) => {
    const tokenExists = await ctx.redis.exists(SPOTIFY_TOKEN);
    if (tokenExists) return await next();
    const spotifyRefreshToken = await ctx.redis.get<string>(
        SPOTIFY_REFRESH_TOKEN
    );
    if (spotifyRefreshToken) {
        await getSpotifyTokenFromRefresh(spotifyRefreshToken)
            .then(({ access_token, expires_in }) =>
                ctx.redis.set(SPOTIFY_REFRESH_TOKEN, access_token, {
                    ex: expires_in,
                })
            )
            .then(() => console.log("Successfully set spotify token"));
        return await next();
    }
    await getSpotifyToken()
        .then(({ access_token, expires_in }) =>
            ctx.redis.set(SPOTIFY_REFRESH_TOKEN, access_token, {
                ex: expires_in,
            })
        )
        .then(() => console.log("Successfully set spotify token"));

    return await next();
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
