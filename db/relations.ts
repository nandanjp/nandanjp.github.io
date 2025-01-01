import { relations } from "drizzle-orm";
import { album, artist, artistToAlbum, track, trackToArtist } from "./schemas";

export const trackArtistRelations = relations(trackToArtist, ({ one }) => ({
    track: one(track, {
        fields: [trackToArtist.trackId],
        references: [track.id],
    }),
    artist: one(artist, {
        fields: [trackToArtist.artistId],
        references: [artist.id],
    }),
}));
export const artistTrackRelation = relations(artist, ({ many }) => ({
    tracks: many(track),
}));
export const trackAlbumRelations = relations(track, ({ one }) => ({
    album: one(album, {
        fields: [track.albumId],
        references: [album.id],
    }),
}));
export const albumTrackRelations = relations(album, ({ many }) => ({
    tracks: many(track),
}));
export const artistAlbumRelations = relations(artistToAlbum, ({ one }) => ({
    artist: one(artist, {
        fields: [artistToAlbum.artistId],
        references: [artist.id],
    }),
    album: one(album, {
        fields: [artistToAlbum.albumId],
        references: [album.id],
    }),
}));
