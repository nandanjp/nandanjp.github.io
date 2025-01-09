"use client";

import { type AppRouter } from "@/server/routers";
import { createColumnHelper } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";

const columnHelper =
    createColumnHelper<
        inferProcedureOutput<AppRouter["spotify"]["artistById"]>
    >();
export const songsColumns = [
    columnHelper.accessor((row) => row.artistImage, {
        id: "albumImage",
        cell: ({ row }) => (
            <Image
                src={row.original.artistImage}
                alt="album image"
                width={row.original.artistImageWidth}
                height={row.original.artistImageHeight}
                className="w-12 rounded-md object-contain"
            />
        ),
    }),
    columnHelper.accessor((row) => row.name, {
        id: "name",
        header: () => <span>Song</span>,
    }),
    columnHelper.accessor((row) => row.spotifyId, {
        id: "spotifyId",
        header: () => <span>SongStatus</span>,
        cell: ({ row }) => <span>{row.original.spotifyId}</span>,
        enableHiding: false,
    }),
];
