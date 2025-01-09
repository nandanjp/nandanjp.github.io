CREATE TYPE "public"."album_release_precision" AS ENUM('year', 'month', 'day');--> statement-breakpoint
CREATE TYPE "public"."album_type" AS ENUM('album', 'single', 'compilation');--> statement-breakpoint
CREATE TYPE "public"."artist_type" AS ENUM('artist');--> statement-breakpoint
CREATE TYPE "public"."playlist_type" AS ENUM('playlist');--> statement-breakpoint
CREATE TYPE "public"."track_type" AS ENUM('track');--> statement-breakpoint
CREATE TABLE "track" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "album_type" DEFAULT 'album' NOT NULL,
	"total_tracks" integer DEFAULT 0 NOT NULL,
	"album_image" text NOT NULL,
	"album_image_width" integer DEFAULT 300 NOT NULL,
	"album_image_height" integer DEFAULT 300 NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"spotify_id" text NOT NULL,
	"genre" text[] DEFAULT '{}'::text[] NOT NULL,
	"label" text DEFAULT '' NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"uri" text NOT NULL,
	"release_date" varchar(255) NOT NULL,
	"release_date_precision" "album_release_precision" DEFAULT 'year' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "track_spotify_id_unique" UNIQUE NULLS NOT DISTINCT("spotify_id")
);
--> statement-breakpoint
CREATE TABLE "artist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"genre" text[] DEFAULT '{}'::text[] NOT NULL,
	"href" text NOT NULL,
	"spotify_id" text NOT NULL,
	"artist_image" text DEFAULT '' NOT NULL,
	"artist_image_width" integer DEFAULT 300 NOT NULL,
	"artist_image_height" integer DEFAULT 300 NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"type" "artist_type" DEFAULT 'artist' NOT NULL,
	"uri" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "artist_spotify_id_unique" UNIQUE NULLS NOT DISTINCT("spotify_id")
);
--> statement-breakpoint
CREATE TABLE "artist_to_album" (
	"artist_id" uuid NOT NULL,
	"album_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "artist_to_album_artist_id_album_id_pk" PRIMARY KEY("artist_id","album_id")
);
--> statement-breakpoint
CREATE TABLE "playlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collaborative" boolean DEFAULT false NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"spotify_id" text NOT NULL,
	"playlist_image" text DEFAULT '' NOT NULL,
	"playlist_image_width" integer DEFAULT 300 NOT NULL,
	"playlist_image_height" integer DEFAULT 300 NOT NULL,
	"name" varchar(255) DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"uri" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "album" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"album_id" uuid NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"explicit" boolean DEFAULT false NOT NULL,
	"spotify_id" text NOT NULL,
	"is_playable" boolean DEFAULT true NOT NULL,
	"name" varchar(255) NOT NULL,
	"popularity" integer DEFAULT 0 NOT NULL,
	"preview_url" text,
	"track_number" integer DEFAULT 0 NOT NULL,
	"type" "track_type" DEFAULT 'track' NOT NULL,
	"uri" text NOT NULL,
	"is_local" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "album_spotify_id_unique" UNIQUE NULLS NOT DISTINCT("spotify_id")
);
--> statement-breakpoint
CREATE TABLE "track_to_artist" (
	"track_id" uuid NOT NULL,
	"artist_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "track_to_artist_track_id_artist_id_pk" PRIMARY KEY("track_id","artist_id")
);
--> statement-breakpoint
ALTER TABLE "artist_to_album" ADD CONSTRAINT "artist_album_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_to_album" ADD CONSTRAINT "artist_album_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."track"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_to_artist" ADD CONSTRAINT "track_artist_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."album"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_to_artist" ADD CONSTRAINT "track_artist_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;