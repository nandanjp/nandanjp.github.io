import { env } from "@/env";
import { Resend } from "resend";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { z } from "zod";
import ContactedByEmail from "@/data/emails/contact";
import { emails } from "@/db/schemas";

const resend = new Resend(env.RESEND_API_KEY);
const sendContactedEmail = publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input: { email } }) => {
        const hasSentMaxEmails = await ctx.db.query.emails.findFirst({
            columns: {
                timesSent: true,
            },
            where: (e, { eq }) => eq(e.senderEmail, email),
        }); //hard coded here lol
        if (hasSentMaxEmails && hasSentMaxEmails.timesSent > 5) return true;

        const { error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["jotaroforall@gmail.com"],
            subject: "Testing",
            react: ContactedByEmail({
                senderEmail: email,
                inviteFromIp: ctx.ip,
            }),
        });
        if (error) return false;
        return await ctx.db
            .transaction(async (tx) =>
                tx
                    .insert(emails)
                    .values({
                        senderEmail: email,
                        timesSent: 1,
                    })
                    .onConflictDoUpdate({
                        target: emails.id,
                        set: {
                            timesSent: (hasSentMaxEmails?.timesSent ?? 0) + 1,
                        },
                    })
            )
            .then(() => true);
    });

export const emailRouter = createTRPCRouter({
    sendContactedEmail,
});
