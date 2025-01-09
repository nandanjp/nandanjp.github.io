import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QueryClient } from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const takeOneOrThrow =
    (message: string) =>
    <T>(values: T[]): T => {
        if (values.length < 1)
            throw new Error(`Found non unique or inexistent value: ${message}`);
        return values[0]!;
    };

export const takeUnique = <T>(values: T[]) => values[0];

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (typeof window === "undefined")
        // Server: always make a new query client
        return makeQueryClient();
    //Browser: make a new query client if we there is not one already
    //This is very important so we don't re-make a new client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}
