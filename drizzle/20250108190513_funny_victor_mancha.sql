ALTER TABLE "emails" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_sender_email_unique" UNIQUE NULLS NOT DISTINCT("sender_email");