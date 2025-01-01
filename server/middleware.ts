import { SPOTIFY_REFRESH_TOKEN, SPOTIFY_TOKEN } from "@/db/redis/keys";
import { t } from "@/server/trpc";
import {
    getSpotifyToken,
    getSpotifyTokenFromRefresh,
} from "@/server/api/spotify/auth";

export const timingMiddleware = t.middleware(async ({ next, path }) => {
    const start = Date.now();
    if (t._config.isDev)
        await new Promise((resolve) =>
            setTimeout(resolve, Math.floor(Math.random() * 400) + 100)
        );

    const result = await next();
    console.log(`[TRPC] ${path} took ${Date.now() - start}ms to execute`);
    return result;
});

export const spotifyMiddleware = t.middleware(async ({ ctx, next }) => {
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

export const githubMiddleware = t.middleware(async ({ ctx, next }) => {
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
