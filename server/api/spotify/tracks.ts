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

export const getTracksByIds = spotifyProcedure
    .input(z.object({ ids: z.string().array() }))
    .query(async ({ ctx, input: { ids } }) => {
        const spotifyIdSet = new Set(ids);
        const existingTracks = await ctx.db.query.track.findMany({
            where: (t, { inArray }) => inArray(t.spotifyId, ids),
            with: {
                album: true,
            },
        });
        if (existingTracks.length === ids.length) {
            const artists = await ctx.db.query.trackToArtist.findMany({
                where: (t, { inArray }) =>
                    inArray(
                        t.trackId,
                        existingTracks.map((t) => t.id)
                    ),
                with: {
                    artist: true,
                },
            });
            return existingTracks.map((track) => {
                const trackArtists = artists.filter(
                    (a) => a.trackId === track.id
                );
                if (!trackArtists)
                    throw new Error(
                        "failed to associated track with an artist"
                    );
                return {
                    ...track,
                    artists: trackArtists.map((a) => a.artist),
                };
            });
        }
        existingTracks.forEach((track) => {
            if (spotifyIdSet.has(track.spotifyId))
                spotifyIdSet.delete(track.spotifyId);
        });

        const spotifyToken = await ctx.redis.get<string>(SPOTIFY_TOKEN);
        if (!spotifyToken)
            throw new Error("failed to retrieve spotify api token");

        // receive information from spotify
        const spotifyTracks = await Promise.all(
            Array.from(spotifyIdSet).map((id) =>
                getSpotifyResource<Track>(spotifyToken, Resource.Tracks, id)
            )
        );
        const spotifyAlbums = await Promise.all(
            spotifyTracks.map((track) =>
                getSpotifyResource<Album>(
                    spotifyToken,
                    Resource.Albums,
                    track.album.id
                )
            )
        );
        const spotifyArtists = await Promise.all(
            spotifyTracks
                .flatMap((track) => track.artists)
                .map((artist) =>
                    getSpotifyResource<Artist>(
                        spotifyToken,
                        Resource.Artists,
                        artist.id
                    )
                )
        );

        return await ctx.db.transaction(async (tx) => {
            const existingAlbums = await tx.query.album.findMany({
                columns: { spotifyId: true, id: true },
                where: (a, { inArray }) =>
                    inArray(
                        a.spotifyId,
                        spotifyAlbums.map((album) => album.id)
                    ),
            });
            const newAlbums = await transactionInsertIntoAlbum(
                tx,
                spotifyAlbums
                    .filter(
                        (album) =>
                            !existingAlbums
                                .map((a) => a.spotifyId)
                                .includes(album.id)
                    )
                    .map((spotifyAlbum) => ({
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
                    }))
            );
            const tracksWithNewAlbumId = spotifyTracks.map((track) => ({
                ...track,
                newAlbumId: newAlbums.find(
                    (album) => album.spotifyId === track.album.id
                )?.id as string, //must exist
            }));
            const newTracks = await transactionInsertIntoTrack(
                tx,
                tracksWithNewAlbumId.map((spotifyTrack) => ({
                    albumId: spotifyTrack.newAlbumId,
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
                }))
            );

            const existingArtists = await tx.query.artist
                .findMany({
                    columns: {
                        spotifyId: true,
                    },
                    where: (a, { inArray }) =>
                        inArray(
                            a.spotifyId,
                            spotifyArtists.map((s) => s.id)
                        ),
                })
                .then((rows) => new Set(rows.map((row) => row.spotifyId)));

            await transactionInsertIntoArtist(
                tx,
                spotifyArtists
                    .filter((artist) => !existingArtists.has(artist.id))
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

            for (const newTrack of newTracks) {
                const spotifyTrack = spotifyTracks.find(
                    (track) => track.id === newTrack.spotifyId
                );
                if (!spotifyTrack) continue;
                const artists = await tx.query.artist.findMany({
                    where: (a, { inArray }) =>
                        inArray(
                            a.spotifyId,
                            spotifyTrack.artists.map((artist) => artist.id)
                        ),
                });
                if (artists.length === 0) continue;
                await transactionInsertIntoTrackToArtist(
                    tx,
                    artists.map((artist) => ({
                        artistId: artist.id,
                        trackId: newTrack.id,
                    }))
                );
            }
            for (const newTrack of newTracks) {
                const spotifyTrack = spotifyTracks.find(
                    (track) => track.id === newTrack.spotifyId
                );
                if (!spotifyTrack) continue;
                const album = await tx.query.album.findFirst({
                    where: (a, { eq }) =>
                        eq(a.spotifyId, spotifyTrack.album.id),
                });
                if (!album) continue;
                const artists = await tx.query.artist.findMany({
                    where: (a, { inArray }) =>
                        inArray(
                            a.spotifyId,
                            spotifyTrack.artists.map((artist) => artist.id)
                        ),
                });
                if (artists.length === 0) continue;

                const newAlbum = newAlbums.find(
                    (a) => a.spotifyId === album.id
                );
                if (!newAlbum) continue;
                await transactionInsertIntoArtistToAlbum(
                    tx,
                    artists.map((artist) => ({
                        artistId: artist.id,
                        albumId: newAlbum.id,
                    }))
                );
            }
            const artists = await ctx.db.query.trackToArtist.findMany({
                where: (t, { inArray }) =>
                    inArray(
                        t.trackId,
                        newTracks.map((t) => t.id)
                    ),
                with: {
                    artist: true,
                },
            });
            return await tx.query.track
                .findMany({
                    where: (t, { inArray }) => inArray(t.spotifyId, ids),
                    with: {
                        album: true,
                    },
                })
                .then((tracks) =>
                    tracks.map((track) => {
                        const trackArtists = artists.filter(
                            (a) => a.trackId === track.id
                        );
                        if (!trackArtists)
                            throw new Error(
                                "failed to associated track with an artist"
                            );
                        return {
                            ...track,
                            artists: trackArtists.map((a) => a.artist),
                        };
                    })
                );
        });
    });

export const getTrackById = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const existingTrack = await ctx.db.query.track.findFirst({
            where: (t, { eq }) => eq(t.spotifyId, id),
            with: {
                album: true,
            },
        });
        if (existingTrack) {
            const artist = await ctx.db.query.trackToArtist.findMany({
                where: (t, { eq }) => eq(t.trackId, existingTrack.id),
                with: {
                    artist: true,
                },
            });
            if (!artist)
                throw new Error("failed to associated track with artists");
            return { ...existingTrack, artists: artist.map((a) => a.artist) };
        }

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
            const trackWithAlbum = await ctx.db.query.track.findFirst({
                where: (t, { eq }) => eq(t.spotifyId, id),
                with: {
                    album: true,
                },
            });
            if (!trackWithAlbum) throw new Error("this should not be possible");
            const artist = await ctx.db.query.artist.findMany({
                where: (a, { inArray }) =>
                    inArray(
                        a.spotifyId,
                        spotifyArtists.map((a) => a.id)
                    ),
            });
            if (!artist)
                throw new Error("failed to associated track with artists");
            return { ...trackWithAlbum, artists: artist };
        });
    });

export const getTrackWithAlbumDetails = spotifyProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
        const existingTrack = await ctx.db.query.track.findFirst({
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
