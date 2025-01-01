import { spotifyProcedure } from "@/server/trpc";
import { z } from "zod";
import {
    AlbumTypeType,
    getSpotifyResource,
    ReleaseDatePrecisionType,
    Resource,
    transactionInsertIntoAlbum,
} from "@/server/api/spotify/queries";
import { Album } from "@/server/api/spotify/types";
import { SPOTIFY_TOKEN } from "@/db/redis/keys";

export const getAlbumById = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const existingAlbum = await ctx.db.query.album.findFirst({
            where: (album, { eq }) => eq(album.spotifyId, id),
        });
        if (existingAlbum) return existingAlbum;
        const spotifyToken = await ctx.redis.get<string>(SPOTIFY_TOKEN);
        if (!spotifyToken)
            throw new Error("failed to retrieve spotify api token");
        return await getSpotifyResource<Album>(
            spotifyToken,
            Resource.Albums,
            id
        ).then((spotifyAlbum) =>
            ctx.db.transaction((tx) =>
                transactionInsertIntoAlbum(tx, [
                    {
                        albumImage: spotifyAlbum.images[0].url,
                        albumImageHeight: spotifyAlbum.images[0].height,
                        albumImageWidth: spotifyAlbum.images[0].width,
                        label: spotifyAlbum.label,
                        releaseDate: spotifyAlbum.release_date,
                        releaseDatePrecision:
                            spotifyAlbum.release_date_precision as ReleaseDatePrecisionType,
                        spotifyId: spotifyAlbum.id,
                        uri: spotifyAlbum.uri,
                        genres: spotifyAlbum.genres,
                        name: spotifyAlbum.name,
                        popularity: spotifyAlbum.popularity,
                        totalTracks: spotifyAlbum.total_tracks,
                        type: spotifyAlbum.type as AlbumTypeType,
                    },
                ]).then(([newAlbum]) => newAlbum)
            )
        );
    });
