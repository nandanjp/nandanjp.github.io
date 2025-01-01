import type { DrizzleTransactionType } from "@/db";
import {
    album,
    artist,
    artistToAlbum,
    playlist,
    track,
    trackToArtist,
} from "@/db/schemas";
import { getRequest } from "@/server/api/helpers";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const BASE_ENDPOINT = "https://api.spotify.com/v1" as const;
export enum Resource {
    Tracks = "tracks",
    Albums = "albums",
    Artists = "artists",
    Playlists = "playlists",
}
export enum Extraneous {
    TopTracks = "top-tracks",
}

export const getSpotifyResource = <T>(
    spotifyToken: string,
    ...args: string[]
) =>
    getRequest<T>(`${BASE_ENDPOINT}/${args.join("/")}`, {
        Authorization: `Bearer ${spotifyToken}`,
    });

export const trackSelectSchema = createSelectSchema(track);
export const albumSelectSchema = createSelectSchema(album, {
    genres: z.array(z.string()),
});
export const artistSelectSchema = createSelectSchema(artist, {
    genres: z.array(z.string()),
});
export const playlistSelectSchema = createSelectSchema(playlist);
export const artistTracksSchema = z.object({
    artist: artistSelectSchema,
    tracks: z.array(trackSelectSchema),
});

export type TrackTypeType = z.infer<typeof trackSelectSchema>["type"];
export type AlbumTypeType = z.infer<typeof albumSelectSchema>["type"];
export type ArtistTypeType = z.infer<typeof artistSelectSchema>["type"];
export type ReleaseDatePrecisionType = z.infer<
    typeof albumSelectSchema
>["releaseDatePrecision"];
export type ArtistTracksType = z.infer<typeof artistTracksSchema>;

export const transactionInsertIntoTrack = async (
    tx: DrizzleTransactionType,
    values: Array<typeof track.$inferInsert>
) => tx.insert(track).values(values).returning();

export const transactionInsertIntoAlbum = async (
    tx: DrizzleTransactionType,
    values: Array<typeof album.$inferInsert>
) => tx.insert(album).values(values).returning();

export const transactionInsertIntoArtist = async (
    tx: DrizzleTransactionType,
    values: Array<typeof artist.$inferInsert>
) => tx.insert(artist).values(values).returning();

export const transactionInsertIntoPlaylist = async (
    tx: DrizzleTransactionType,
    values: Array<typeof playlist.$inferInsert>
) => tx.insert(playlist).values(values).returning();

export const transactionInsertIntoTrackToArtist = async (
    tx: DrizzleTransactionType,
    values: Array<typeof trackToArtist.$inferInsert>
) => tx.insert(trackToArtist).values(values).returning();

export const transactionInsertIntoArtistToAlbum = async (
    tx: DrizzleTransactionType,
    values: Array<typeof artistToAlbum.$inferInsert>
) => tx.insert(artistToAlbum).values(values).returning();
