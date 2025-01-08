"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { type AppRouter } from "@/server/routers";
import { createColumnHelper } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";

const columnHelper =
    createColumnHelper<
        inferProcedureOutput<AppRouter["spotify"]["trackById"]>
    >();
export const songsColumns = [
    columnHelper.display({
        id: "album.albumImage",
        cell: ({ row }) => (
            <Image
                src={row.original.album.albumImage}
                alt="album image"
                width={row.original.album.albumImageWidth}
                height={row.original.album.albumImageHeight}
                className="min-w-12 max-w-16 rounded-md object-contain"
            />
        ),
    }),
    columnHelper.accessor((row) => row.name, {
        id: "name",
        header: () => <span className="text-center">Song</span>,
    }),
    columnHelper.display({
        id: "artists",
        cell: ({ row }) => (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant="link">@artists</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit flex flex-col gap-2">
                    {row.original.artists.map((artist) => (
                        <div
                            className="flex items-center gap-4"
                            key={artist.id}
                        >
                            <Avatar>
                                <AvatarImage src={artist.artistImage} />
                                <AvatarFallback>VC</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1 items-start justify-start">
                                <Link
                                    href={`https://open.spotify.com/artist/${artist.spotifyId}`}
                                    className={
                                        "text-primary underline-offset-4 hover:underline"
                                    }
                                    target="_blank"
                                >
                                    {artist.name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </HoverCardContent>
            </HoverCard>
        ),
    }),
    columnHelper.accessor((row) => row.album.name, {
        id: "album.name",
        header: () => <span className="text-center">Album</span>,
        cell: ({ row }) => <span>{row.original.album.name}</span>,
    }),
    columnHelper.accessor((row) => row.album.label, {
        id: "album.label",
        header: () => <span className="text-center">Label</span>,
        cell: ({ row }) => <span>{row.original.album.label}</span>,
    }),
    columnHelper.display({
        id: "spotifyId",
        cell: ({ row }) => (
            <Link
                href={`https://open.spotify.com/track/${row.original.spotifyId}`}
                className={cn(buttonVariants({ variant: "outline" }))}
                target="_blank"
            >
                Go to Spotify
            </Link>
        ),
    }),
];
