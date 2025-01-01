import { createTRPCRouter, spotifyProcedure } from "@/server/trpc";

export const githubRouter = createTRPCRouter({
    allTracks: spotifyProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.track.findMany();
    }),
    allArtists: spotifyProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.artist.findMany();
    }),
    allAlbums: spotifyProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.album.findMany();
    }),
    allPlaylists: spotifyProcedure.query(async ({ ctx }) => {
        return await ctx.db.query.playlist.findMany();
    }),
});
