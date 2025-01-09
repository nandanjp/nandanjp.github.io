CREATE TABLE "emails" (
	"id" uuid NOT NULL,
	"sender_email" varchar(255),
	"times_sent" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
