import { env } from "@/env";
import axios from "axios";
import qs from "qs";
import { z } from "zod";
import { GET_TOKEN_ENDPOINT } from "./endpoints";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authRequestSchema = z
    .object({
        grant_type: z.enum([
            "client_credentials",
            "refresh_token",
            "authorization_code",
        ]),
        client_id: z.string().optional(),
        client_secret: z.string().optional(),
        refresh_token: z.string().optional(),
    })
    .refine(
        (data) =>
            (data.grant_type === "client_credentials" &&
                data.client_id &&
                data.client_secret) ||
            (data.grant_type === "refresh_token" && data.refresh_token),
        {
            message:
                "Invalid fields: For 'client_credentials', 'client_id' and 'client_secret' are required. For 'refresh_token', 'refresh_token' is required.",
            path: ["grant_type"], // Optionally specify which field to show error on
        }
    );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authResponseSchema = z.object({
    access_token: z.string(),
    token_type: z.object({
        value: z.any().optional(),
        done: z.boolean(),
    }), //BuiltinIteratorReturn
    expires_in: z.number(),
    refresh_token: z.string(),
});

export const getSpotifyToken = () =>
    axios
        .post(
            GET_TOKEN_ENDPOINT,
            qs.stringify({
                grant_type: "client_credentials",
            } as z.infer<typeof authRequestSchema>),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64")}`,
                },
            }
        )
        .then((res) => res.data as z.infer<typeof authResponseSchema>)
        .catch((e) => {
            throw new Error(
                "failed to retrieve and set spotify token to redis:",
                e
            );
        });

export const getSpotifyTokenFromRefresh = (refreshToken: string) =>
    axios
        .post(
            GET_TOKEN_ENDPOINT,
            qs.stringify({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: env.SPOTIFY_CLIENT_ID,
            } as z.infer<typeof authRequestSchema>),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then((res) => res.data as z.infer<typeof authResponseSchema>)
        .catch((e) => {
            throw new Error(
                "failed to retrieve and set spotify token to redis from refresh:",
                e
            );
        });
