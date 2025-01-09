import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        ARCJET_KEY: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
        SUPABASE_PROJECT_URL: z.string().url(),
        SUPABASE_ANON_KEY: z.string().min(1),
        DATABASE_URL: z.string().url(),
        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string(),
        GITHUB_API_TOKEN: z.string().min(1),
        SPOTIFY_CLIENT_ID: z.string().min(1),
        SPOTIFY_CLIENT_SECRET: z.string().min(1),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
    },
    clientPrefix: "PUBLIC_",
    client: {},

    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
