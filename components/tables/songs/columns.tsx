"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playlistPromotionMap, quickAddPlacements } from "@/utils/constants";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { FulfillmentType } from "./queries";
import {
    Action,
    AddNote,
    BadMusicEmailModal,
    CheckIn,
    SpotifyPlayer,
    Streams,
    UpdateEmail,
    UpdateSpotifyId,
    UpgradeCampaignStatus,
    UpgradePlaylistSongStatus,
} from "./row-actions";
import { NewQuickAdd } from "./new-quick-add-button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

const formatNumShort = (num: number, decimals: number = 1) =>
    num % 1 === 0 ? num.toString() : num.toFixed(decimals);
const convertToShortScale = (num: number) =>
    Math.abs(num) >= 1.0e9
        ? formatNumShort(Math.abs(num) / 1.0e9) + "b"
        : Math.abs(num) >= 1.0e6
        ? formatNumShort(Math.abs(num) / 1.0e6) + "m"
        : Math.abs(num) >= 1.0e3
        ? formatNumShort(Math.abs(num) / 1.0e3) + "k"
        : formatNumShort(Math.abs(num), 2);

const columnHelper = createColumnHelper<FulfillmentType[number]>();

export const fulfillmentColumns = [
    columnHelper.accessor((row) => row.checkoutOrder.createdAt, {
        id: "createdAt",
        header: () => <span>Created</span>,
        cell: ({ row }) => (
            <span>
                {moment(row.original.checkoutOrder.createdAt).format(
                    "MMMM D YYYY"
                )}
            </span>
        ),
    }),
    columnHelper.accessor((row) => row.songName, {
        id: "songName",
        header: () => <span className="line-clamp-1 text-ellipsis">Song</span>,
        cell: ({ row }) => (
            <span className="line-clamp-2 text-ellipsis">
                {row.original.songName}
            </span>
        ),
        enableHiding: false,
    }),
    columnHelper.accessor((row) => row.checkoutOrder.orderValue, {
        id: "checkoutOrder.orderValue",
        header: () => <span>OrderValue</span>,
        cell: (props) => (
            <span>
                {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(props.row.original.checkoutOrder.orderValue)}
            </span>
        ),
    }),
    columnHelper.accessor((row) => row.checkoutOrder.orderNumber, {
        id: "checkoutOrder.orderNumber",
        header: () => <span>OrderNumber</span>,
        cell: ({ row }) => (
            <Link
                className={cn(buttonVariants({ variant: "link" }))}
                href={`/boost-admin/playlisting/${Number(
                    row.original.checkoutOrder.orderNumber
                )}`}
            >
                {Number(row.original.checkoutOrder.orderNumber)}
            </Link>
        ),
    }),
    columnHelper.display({
        id: "isMonthly",
        header: () => <span>Type</span>,
        cell: ({ row }) => (
            <span>{!row.original.isMonthly ? "onetime" : "ongoing"}</span>
        ),
    }),
    columnHelper.accessor((row) => row.songStatus, {
        id: "songStatus",
        header: () => <span>SongStatus</span>,
        cell: ({ row }) => (
            <UpgradePlaylistSongStatus
                songId={row.original.id}
                songStatus={row.original.songStatus}
            />
        ),
        enableHiding: false,
    }),
    columnHelper.accessor((row) => row.checkoutOrder.status, {
        id: "checkoutOrder.status",
        header: () => <span>OrderStatus</span>,
        cell: ({ row }) => (
            <UpgradeCampaignStatus
                orderNumber={row.original.checkoutOrder.orderNumber}
                orderStatus={row.original.checkoutOrder.status}
            />
        ),
    }),
    columnHelper.display({
        id: "spotifyId",
        header: () => <span>SpotifyId</span>,
        cell: ({ row }) => (
            <UpdateSpotifyId
                songId={row.original.songId}
                spotifyId={row.original.spotifyId}
            />
        ),
        enableHiding: false,
    }),
    columnHelper.display({
        id: "player",
        header: () => <span>SpotifyPlayer</span>,
        cell: ({ row }) => <SpotifyPlayer spotifyId={row.original.spotifyId} />,
    }),
    columnHelper.accessor((row) => row.checkoutOrder.metadata, {
        id: "checkoutOrder.metadata",
        header: () => <span>Details</span>,
        cell: ({ row }) => (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button
                        variant="outline"
                        className="line-clamp-1 max-w-44 text-ellipsis whitespace-nowrap"
                    >
                        {JSON.parse(
                            JSON.stringify(row.original.checkoutOrder.metadata)
                        )?.campaign ?? ""}
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                    {JSON.parse(
                        JSON.stringify(row.original.checkoutOrder.metadata)
                    )?.campaign ?? ""}
                </HoverCardContent>
            </HoverCard>
        ),
    }),
    columnHelper.accessor((row) => row.checkoutOrder.firstName, {
        id: "checkoutOrder.firstName",
        header: () => <span>FirstName</span>,
        cell: ({ row }) => <span>{row.original.checkoutOrder.firstName}</span>,
        enableHiding: false,
    }),
    columnHelper.accessor((row) => row.checkoutOrder.email, {
        id: "checkoutOrder.email",
        header: () => <span>Email</span>,
        cell: ({ row }) => (
            <UpdateEmail
                orderNumber={row.original.checkoutOrder.orderNumber}
                email={row.original.checkoutOrder.email}
            />
        ),
        enableHiding: false,
    }),
    columnHelper.display({
        id: "action",
        header: () => <span>Action</span>,
        cell: ({ row }) => (
            <Action
                orderIndex={row.original.checkoutOrder.playlistSongIndex}
                orderNumber={row.original.checkoutOrder.orderNumber}
                songStatus={row.original.songStatus}
                spotifyId={row.original.spotifyId}
            />
        ),
    }),
    columnHelper.display({
        id: "quickAdd",
        header: () => <span>QuickAdd</span>,
        cell: ({ row, table }) => {
            if (
                !(
                    row.original.spotifyId &&
                    row.original.songStatus !== "playlisted"
                )
            )
                return null;
            if (
                !row.original.tier ||
                !quickAddPlacements.has(row.original.tier)
            )
                return "quick add requires a tier";

            return (
                <NewQuickAdd
                    id={row.original.id}
                    songName={row.original.songName}
                    spotifyId={row.original.spotifyId}
                    tier={row.original.tier}
                    genres={table.options.meta?.genres}
                    playlists={table.options.meta?.playlists}
                    sfa={row.original.checkoutOrder.sfa}
                />
            );
        },
    }),
    columnHelper.display({
        id: "notes",
        header: () => <span>Notes</span>,
        cell: ({ row }) => (
            <AddNote songId={row.original.id} notes={row.original.notes} />
        ),
    }),
    columnHelper.display({
        id: "streams",
        header: () => <span>Streams</span>,
        cell: ({ row }) => (
            <Streams
                songId={row.original.id}
                artistId={row.original.checkoutOrder.artistId}
                spotifyId={row.original.spotifyId}
                originalStreams={row.original.originalStreams}
                originalStreamsDate={row.original.originalStreamsDate}
            />
        ),
    }),
    columnHelper.display({
        id: "target",
        header: () => <span>Target</span>,
        cell: ({ row }) => (
            <span>
                {playlistPromotionMap[row.original.tier]?.streams?.min
                    ? convertToShortScale(
                          playlistPromotionMap[row.original.tier]?.streams?.min
                      )
                    : ""}
            </span>
        ),
    }),
    columnHelper.display({
        id: "sfa",
        header: () => <span>SFA</span>,
        cell: ({ row }) => (
            <Link
                className={cn(buttonVariants({ variant: "link" }))}
                href={`https://artists.spotify.com/c/artist/${Number(
                    row.original.checkoutOrder.artistId
                )}/home`}
                target="_blank"
            >
                Open SFA
            </Link>
        ),
    }),
    columnHelper.accessor((row) => row.purgedBy, {
        id: "purgedBy",
        header: () => <span>PurgeStatus</span>,
        cell: ({ row }) => (
            <span>
                {row.original.purgedBy
                    ? `purged by ${row.original.purgedBy}${
                          row.original.purgedBy === "autopurge"
                              ? row.original.complete
                                  ? " (met stream target)" // since only the stream tracker sets complete
                                  : " (expired)"
                              : ""
                      }`
                    : row.original.songStatus === "finished"
                    ? "purged by (unknown)"
                    : "not purged"}
            </span>
        ),
    }),
    columnHelper.accessor((row) => row.checkInPriority, {
        id: "checkInPriority",
        header: () => <span>CheckIn</span>,
        cell: ({ row }) => (
            <CheckIn
                orderIndex={row.original.checkoutOrder.playlistSongIndex}
                orderNumber={row.original.checkoutOrder.orderNumber}
                priority={row.original.checkInPriority}
                songId={row.original.id}
            />
        ),
    }),
    columnHelper.display({
        id: "badMusicEmail",
        header: () => <span>BadMusic</span>,
        cell: ({ row }) => {
            return (
                <BadMusicEmailModal
                    email={row.original.checkoutOrder.email}
                    firstName={row.original.checkoutOrder.firstName}
                    songName={row.original.songName}
                    orderNumber={row.original.checkoutOrder.orderNumber}
                    songId={row.original.id}
                />
            );
        },
        enableHiding: false,
    }),
];
