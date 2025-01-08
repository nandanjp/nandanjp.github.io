import { createTRPCRouter, spotifyProcedure } from "@/server/trpc";
import { getAlbumById } from "./albums";
import { getArtistById, getArtistTracks } from "./artists";
import { getPlaylistById } from "./playlists";
import {
    getTrackById,
    getTracksByIds,
    getTrackWithAlbumDetails,
} from "./tracks";

export const spotifyRouter = createTRPCRouter({
    getTracksByIds,
    trackById: getTrackById,
    trackWithAlbum: getTrackWithAlbumDetails,
    albumById: getAlbumById,
    artistById: getArtistById,
    playlistById: getPlaylistById,
    artistTracks: getArtistTracks,
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
