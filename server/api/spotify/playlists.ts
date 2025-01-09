import { SPOTIFY_TOKEN } from "@/db/redis/keys";
import {
    getSpotifyResource,
    Resource,
    transactionInsertIntoPlaylist,
} from "@/server/api/spotify/queries";
import type { Playlist } from "@/server/api/spotify/types";
import { spotifyProcedure } from "@/server/trpc";
import { z } from "zod";

export const getPlaylistById = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const existingPlaylist = await ctx.db.query.playlist.findFirst({
            where: (list, { eq }) => eq(list.spotifyId, id),
        });
        if (existingPlaylist) return existingPlaylist;
        const spotifyToken = await ctx.redis.get<string>(SPOTIFY_TOKEN);
        if (!spotifyToken)
            throw new Error("failed to retrieve spotify api token");

        return await getSpotifyResource<Playlist>(
            spotifyToken,
            Resource.Albums,
            id
        ).then((spotifyPlaylist) =>
            ctx.db.transaction((tx) =>
                transactionInsertIntoPlaylist(tx, [
                    {
                        spotifyId: spotifyPlaylist.id,
                        collaborative: spotifyPlaylist.collaborative,
                        description: spotifyPlaylist.description,
                        name: spotifyPlaylist.name,
                        playlistImage: spotifyPlaylist.images[0].url,
                        playlistImageHeight: spotifyPlaylist.images[0].height,
                        playlistImageWidth: spotifyPlaylist.images[0].width,
                        public: spotifyPlaylist.public,
                        uri: spotifyPlaylist.uri,
                        userId: spotifyPlaylist.owner.id,
                    },
                ]).then(([newPlaylist]) => newPlaylist)
            )
        );
    });
