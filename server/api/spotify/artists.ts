import { SPOTIFY_TOKEN } from "@/db/redis/keys";
import {
    ArtistTypeType,
    getSpotifyResource,
    Resource,
    transactionInsertIntoArtist,
} from "@/server/api/spotify/queries";
import type { Artist } from "@/server/api/spotify/types";
import { spotifyProcedure } from "@/server/trpc";
import { z } from "zod";

export const getArtistById = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const existingArtist = await ctx.db.query.artist.findFirst({
            where: (artist, { eq }) => eq(artist.spotifyId, id),
        });
        if (existingArtist) return existingArtist;
        const spotifyToken = await ctx.redis.get<string>(SPOTIFY_TOKEN);
        if (!spotifyToken)
            throw new Error("failed to retrieve spotify api token");

        return await getSpotifyResource<Artist>(
            spotifyToken,
            Resource.Albums,
            id
        ).then((spotifyArtist) =>
            ctx.db.transaction((tx) =>
                transactionInsertIntoArtist(tx, [
                    {
                        href: spotifyArtist.href,
                        spotifyId: spotifyArtist.id,
                        artistImage: spotifyArtist.images[0].url,
                        artistImageHeight: spotifyArtist.images[0].height,
                        artistImageWidth: spotifyArtist.images[0].width,
                        genres: spotifyArtist.genres,
                        name: spotifyArtist.name,
                        popularity: spotifyArtist.popularity,
                        uri: spotifyArtist.uri,
                        type: spotifyArtist.type as ArtistTypeType,
                    },
                ]).then(([newArtist]) => newArtist)
            )
        );
    });

export const getArtistTracks = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const artist = await ctx.db.query.artist.findFirst({
            where: (a, { eq }) => eq(a.spotifyId, id),
            with: {
                tracks: true,
            },
        });
        if (!artist) return null;

        return artist;
    });
