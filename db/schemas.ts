import { sql } from "drizzle-orm";
import {
    boolean,
    foreignKey,
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
    varchar,
    pgEnum,
    unique,
} from "drizzle-orm/pg-core";

export const albumTypeEnum = pgEnum("album_type", [
    "album",
    "single",
    "compilation",
]);
export const artistTypeEnum = pgEnum("artist_type", ["artist"]);
export const trackType = pgEnum("track_type", ["track"]);
export const playlistTypeEnum = pgEnum("playlist_type", ["playlist"]);
export const albumReleaseDatePrecisionEnum = pgEnum("album_release_precision", [
    "year",
    "month",
    "day",
]);

export const artist = pgTable(
    "artist",
    {
        id: uuid("id").primaryKey().notNull().defaultRandom(),
        genres: text("genre")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        href: text("href").notNull(),
        spotifyId: text("spotify_id").notNull(),
        artistImage: text("artist_image").notNull().default(""),
        artistImageWidth: integer("artist_image_width").notNull().default(300),
        artistImageHeight: integer("artist_image_height")
            .notNull()
            .default(300),
        name: varchar("name", { length: 255 }).notNull().default(""),
        popularity: integer("popularity").notNull().default(0),
        type: artistTypeEnum("type").notNull().default("artist"),
        uri: text("uri").notNull().default(""),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [[unique().on(table.spotifyId).nullsNotDistinct()]]
);

export const playlist = pgTable("playlist", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    collaborative: boolean("collaborative").notNull().default(false),
    description: text("description").notNull().default(""),
    spotifyId: text("spotify_id").notNull(),
    playlistImage: text("playlist_image").notNull().default(""),
    playlistImageWidth: integer("playlist_image_width").notNull().default(300),
    playlistImageHeight: integer("playlist_image_height")
        .notNull()
        .default(300),
    name: varchar("name", { length: 255 }).notNull().default(""),
    userId: text("user_id").notNull(),
    public: boolean("public").notNull().default(false),
    uri: text("uri").notNull().default(""),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const track = pgTable(
    "album",
    {
        id: uuid("id").primaryKey().notNull().defaultRandom(),
        albumId: uuid("album_id").notNull(),
        durationMs: integer("duration_ms").notNull().default(0),
        explicit: boolean("explicit").notNull().default(false),
        spotifyId: text("spotify_id").notNull(),
        isPlayable: boolean("is_playable").notNull().default(true),
        name: varchar("name", { length: 255 }).notNull(),
        popularity: integer("popularity").notNull().default(0),
        previewUrl: text("preview_url"),
        trackNumber: integer("track_number").notNull().default(0),
        type: trackType("type").notNull().default("track"),
        uri: text("uri").notNull(),
        isLocal: boolean("is_local").notNull().default(false),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [[unique().on(table.spotifyId).nullsNotDistinct()]]
);

export const trackToArtist = pgTable(
    "track_to_artist",
    {
        trackId: uuid("track_id").notNull(),
        artistId: uuid("artist_id").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.trackId, table.artistId] }),
        foreignKey({
            columns: [table.trackId],
            foreignColumns: [track.id],
            name: "track_artist_track_id_fkey",
        }),
        foreignKey({
            columns: [table.artistId],
            foreignColumns: [artist.id],
            name: "track_artist_artist_id_fkey",
        }),
    ]
);

export const album = pgTable(
    "track",
    {
        id: uuid("id").primaryKey().notNull().defaultRandom(),
        type: albumTypeEnum("type").notNull().default("album"),
        totalTracks: integer("total_tracks").notNull().default(0),
        albumImage: text("album_image").notNull(),
        albumImageWidth: integer("album_image_width").notNull().default(300),
        albumImageHeight: integer("album_image_height").notNull().default(300),
        name: varchar("name", { length: 255 }).notNull().default(""),
        spotifyId: text("spotify_id").notNull(),
        genres: text("genre")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        label: text("label").notNull().default(""),
        popularity: integer("popularity").notNull().default(0),
        uri: text("uri").notNull(),
        releaseDate: varchar("release_date", { length: 255 }).notNull(),
        releaseDatePrecision: albumReleaseDatePrecisionEnum(
            "release_date_precision"
        )
            .notNull()
            .default("year"),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [[unique().on(table.spotifyId).nullsNotDistinct()]]
);

export const artistToAlbum = pgTable(
    "artist_to_album",
    {
        artistId: uuid("artist_id").notNull(),
        albumId: uuid("album_id").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.artistId, table.albumId],
        }),
        foreignKey({
            columns: [table.artistId],
            foreignColumns: [artist.id],
            name: "artist_album_artist_id_fkey",
        }),
        foreignKey({
            columns: [table.albumId],
            foreignColumns: [album.id],
            name: "artist_album_album_id_fkey",
        }),
    ]
);

export const emails = pgTable(
    "emails",
    {
        id: uuid("id").primaryKey().notNull().defaultRandom(),
        senderEmail: varchar("sender_email", { length: 255 }),
        timesSent: integer("times_sent").notNull().default(0),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [unique().on(table.senderEmail).nullsNotDistinct()]
);
