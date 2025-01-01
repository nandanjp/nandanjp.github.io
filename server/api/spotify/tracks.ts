import { db } from "@/db";
import { SPOTIFY_TOKEN } from "@/db/redis/keys";
import {
    AlbumTypeType,
    ArtistTypeType,
    getSpotifyResource,
    ReleaseDatePrecisionType,
    Resource,
    TrackTypeType,
    transactionInsertIntoAlbum,
    transactionInsertIntoArtist,
    transactionInsertIntoArtistToAlbum,
    transactionInsertIntoTrack,
    transactionInsertIntoTrackToArtist,
} from "@/server/api/spotify/queries";
import type { Album, Artist, Track } from "@/server/api/spotify/types";
import { spotifyProcedure } from "@/server/trpc";
import { z } from "zod";

export const getTrackById = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const existingTrack = await ctx.db.query.track.findFirst({
            where: (t, { eq }) => eq(t.spotifyId, id),
        });
        if (existingTrack) return existingTrack;

        const spotifyToken = await ctx.redis.get<string>(SPOTIFY_TOKEN);
        if (!spotifyToken)
            throw new Error("failed to retrieve spotify api token");
        const spotifyTrack = await getSpotifyResource<Track>(
            spotifyToken,
            Resource.Tracks,
            id
        );
        const spotifyAlbum = await getSpotifyResource<Album>(
            spotifyToken,
            Resource.Albums,
            spotifyTrack.album.id
        );
        const spotifyArtists = await Promise.all(
            spotifyTrack.artists.map((artist) =>
                getSpotifyResource<Artist>(
                    spotifyToken,
                    Resource.Artists,
                    artist.id
                )
            )
        );

        return await ctx.db.transaction(async (tx) => {
            const newAlbum = await tx.query.album
                .findFirst({
                    where: (a, { eq }) => eq(a.spotifyId, spotifyAlbum.id),
                })
                .then((exists) => {
                    if (exists) return exists;
                    return transactionInsertIntoAlbum(tx, [
                        {
                            name: spotifyAlbum.name,
                            spotifyId: spotifyAlbum.id,
                            type: spotifyAlbum.type as AlbumTypeType,
                            albumImage: spotifyAlbum.images[0].url,
                            albumImageHeight: spotifyAlbum.images[0].height,
                            albumImageWidth: spotifyAlbum.images[0].width,
                            label: spotifyAlbum.label,
                            popularity: spotifyAlbum.popularity,
                            releaseDate: spotifyAlbum.release_date,
                            releaseDatePrecision:
                                spotifyAlbum.release_date_precision as ReleaseDatePrecisionType,
                            totalTracks: spotifyAlbum.total_tracks,
                            genres: spotifyAlbum.genres,
                            uri: spotifyAlbum.uri,
                        },
                    ]).then(([newAlbum]) => newAlbum);
                });

            const newTrack = await transactionInsertIntoTrack(tx, [
                {
                    albumId: newAlbum.id,
                    durationMs: spotifyTrack.duration_ms,
                    explicit: spotifyTrack.explicit,
                    isLocal: spotifyTrack.is_local,
                    isPlayable: spotifyTrack.is_playable,
                    name: spotifyTrack.name,
                    popularity: spotifyTrack.popularity,
                    previewUrl: spotifyTrack.preview_url,
                    spotifyId: spotifyTrack.id,
                    trackNumber: spotifyTrack.track_number,
                    type: spotifyTrack.type as TrackTypeType,
                    uri: spotifyTrack.uri,
                },
            ]).then(([newAlbum]) => newAlbum);

            const nonExistingArtists = await tx.query.artist
                .findMany({
                    columns: {
                        spotifyId: true,
                    },
                    where: (a, { not, inArray }) =>
                        not(
                            inArray(
                                a.spotifyId,
                                spotifyArtists.map((s) => s.id)
                            )
                        ),
                })
                .then((rows) => new Set(rows.map((row) => row.spotifyId)));
            const newArtists = await transactionInsertIntoArtist(
                tx,
                spotifyArtists
                    .filter((artist) => nonExistingArtists.has(artist.id))
                    .map((spotifyArtist) => ({
                        name: spotifyArtist.name,
                        href: spotifyArtist.href,
                        spotifyId: spotifyArtist.id,
                        artistImage: spotifyArtist.images[0].url,
                        artistImageHeight: spotifyArtist.images[0].height,
                        artistImageWidth: spotifyArtist.images[0].width,
                        genres: spotifyArtist.genres,
                        popularity: spotifyArtist.popularity,
                        type: spotifyArtist.type as ArtistTypeType,
                        uri: spotifyArtist.uri,
                    }))
            );
            await transactionInsertIntoTrackToArtist(
                tx,
                newArtists.map((artist) => ({
                    artistId: artist.id,
                    trackId: newTrack.id,
                }))
            );
            await transactionInsertIntoArtistToAlbum(
                tx,
                newArtists.map((artist) => ({
                    artistId: artist.id,
                    albumId: newAlbum.id,
                }))
            );
            return newTrack;
        });
    });

export const getTrackWithAlbumDetails = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const existingTrack = await db.query.track.findFirst({
            where: (t, { eq }) => eq(t.spotifyId, id),
            with: {
                album: true,
            },
        });
        if (existingTrack) return existingTrack;

        const spotifyToken = await ctx.redis.get<string>(SPOTIFY_TOKEN);
        if (!spotifyToken)
            throw new Error("failed to retrieve spotify api token");
        const spotifyTrack = await getSpotifyResource<Track>(
            spotifyToken,
            Resource.Tracks,
            id
        );
        const spotifyAlbum = await getSpotifyResource<Album>(
            spotifyToken,
            Resource.Albums,
            spotifyTrack.album.id
        );
        const spotifyArtists = await Promise.all(
            spotifyTrack.artists.map((artist) =>
                getSpotifyResource<Artist>(
                    spotifyToken,
                    Resource.Artists,
                    artist.id
                )
            )
        );

        return await ctx.db.transaction(async (tx) => {
            const newAlbum = await tx.query.album
                .findFirst({
                    where: (a, { eq }) => eq(a.spotifyId, spotifyAlbum.id),
                })
                .then((exists) => {
                    if (exists) return exists;
                    return transactionInsertIntoAlbum(tx, [
                        {
                            name: spotifyAlbum.name,
                            spotifyId: spotifyAlbum.id,
                            type: spotifyAlbum.type as AlbumTypeType,
                            albumImage: spotifyAlbum.images[0].url,
                            albumImageHeight: spotifyAlbum.images[0].height,
                            albumImageWidth: spotifyAlbum.images[0].width,
                            label: spotifyAlbum.label,
                            popularity: spotifyAlbum.popularity,
                            releaseDate: spotifyAlbum.release_date,
                            releaseDatePrecision:
                                spotifyAlbum.release_date_precision as ReleaseDatePrecisionType,
                            totalTracks: spotifyAlbum.total_tracks,
                            genres: spotifyAlbum.genres,
                            uri: spotifyAlbum.uri,
                        },
                    ]).then(([newAlbum]) => newAlbum);
                });

            const newTrack = await transactionInsertIntoTrack(tx, [
                {
                    albumId: newAlbum.id,
                    durationMs: spotifyTrack.duration_ms,
                    explicit: spotifyTrack.explicit,
                    isLocal: spotifyTrack.is_local,
                    isPlayable: spotifyTrack.is_playable,
                    name: spotifyTrack.name,
                    popularity: spotifyTrack.popularity,
                    previewUrl: spotifyTrack.preview_url,
                    spotifyId: spotifyTrack.id,
                    trackNumber: spotifyTrack.track_number,
                    type: spotifyTrack.type as TrackTypeType,
                    uri: spotifyTrack.uri,
                },
            ]).then(([newTrack]) => newTrack);

            const nonExistingArtists = await tx.query.artist
                .findMany({
                    columns: {
                        spotifyId: true,
                    },
                    where: (a, { not, inArray }) =>
                        not(
                            inArray(
                                a.spotifyId,
                                spotifyArtists.map((s) => s.id)
                            )
                        ),
                })
                .then((rows) => new Set(rows.map((row) => row.spotifyId)));

            const newArtists = await transactionInsertIntoArtist(
                tx,
                spotifyArtists
                    .filter((artist) => nonExistingArtists.has(artist.id))
                    .map((spotifyArtist) => ({
                        name: spotifyArtist.name,
                        href: spotifyArtist.href,
                        spotifyId: spotifyArtist.id,
                        artistImage: spotifyArtist.images[0].url,
                        artistImageHeight: spotifyArtist.images[0].height,
                        artistImageWidth: spotifyArtist.images[0].width,
                        genres: spotifyArtist.genres,
                        popularity: spotifyArtist.popularity,
                        type: spotifyArtist.type as ArtistTypeType,
                        uri: spotifyArtist.uri,
                    }))
            );
            await transactionInsertIntoTrackToArtist(
                tx,
                newArtists.map((artist) => ({
                    artistId: artist.id,
                    trackId: newTrack.id,
                }))
            );
            await transactionInsertIntoArtistToAlbum(
                tx,
                newArtists.map((artist) => ({
                    artistId: artist.id,
                    albumId: newAlbum.id,
                }))
            );

            return tx.query.track.findFirst({
                where: (t, { eq }) => eq(t.id, newTrack.id),
                with: {
                    album: true,
                },
            });
        });
    });
