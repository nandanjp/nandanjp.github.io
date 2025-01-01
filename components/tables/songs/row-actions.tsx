"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
    PlaylistPromoEnumSchema,
    PlaylistPromoEnumType,
} from "@/db/enum.types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
    ArrowDown,
    ArrowUp,
    Check,
    ChevronsUpDown,
    MoreHorizontal,
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    actionAddNoteToSong,
    actionSetCheckInResponseStatus,
    actionUpdateOrderEmail,
    actionUpdateSongSpotifyId,
    actionUpdateStreamsCount,
    actionUpgradeOrderStatus,
    actionUpgradePlaylistSongStatus,
} from "./actions";
import { usePlaylistingStore } from "./playlisting-store";
import { actionSendBadMusicEmail } from "@/data/server/email-actions";

const spotifyIdSchema = z.object({
    spotifyId: z.string(),
});

const noteSchema = z.object({
    note: z.string().min(2),
});

const emailSchema = z.object({
    email: z.string().email(),
});

const badMusicSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(2).trim(),
    name: z.string().min(2).trim(),
    title: z.string().min(2).trim(),
});

const parseSpotifyId = (urlOrId: string) => {
    if (!urlOrId) return null;
    const id = urlOrId.startsWith("spotify:")
        ? urlOrId.split(":").pop()
        : urlOrId.startsWith("https://open.spotify.com/")
        ? urlOrId.split("/").pop()
        : urlOrId;
    return id.includes("?") ? id.split("?")[0] : id;
};

function ConfirmationModal({
    onConfirm,
    triggerTitle,
    title,
    description,
    content,
    isPending,
}: {
    triggerTitle: string;
    title: string;
    description: string;
    content: string;
    onConfirm: () => void;
    isPending: boolean;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">{triggerTitle}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4">
                    <p>{content}</p>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirm();
                            }}
                            disabled={isPending}
                        >
                            {isPending ? <Spinner /> : "Confirm"}
                        </Button>
                        <DialogClose>
                            <Button variant="destructive">Close</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function IgnoreModal({ songId }: { songId: string }) {
    const { toast } = useToast();
    const setIgnoreStatus = useMutation({
        mutationKey: [songId, "ignore-status"],
        mutationFn: async () => {
            const { data, error } = await actionSetCheckInResponseStatus(
                songId,
                0,
                "ignored"
            );
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Set Check in Response Status",
                description: `Successfully set the check in response status to ignore`,
            }),
        onError: (_) =>
            toast({
                title: "Set Check in Response Status",
                description: `Failed to set the check in response status to ignore`,
                variant: "destructive",
            }),
    });

    return (
        <ConfirmationModal
            triggerTitle="Ignore"
            title="Check in Ignore"
            description="Ignore warning?"
            content="Please only ignore re-adding this artist if 1) the song is bad or 2) we are on track to
            hit the stream target in 4 weeks."
            onConfirm={() => setIgnoreStatus.mutate()}
            isPending={setIgnoreStatus.isPending}
        />
    );
}

function BadMusicModal({ songId }: { songId: string }) {
    const { toast } = useToast();
    const setBadMusicStatus = useMutation({
        mutationKey: [songId, "bad-music-status"],
        mutationFn: async () => {
            const { data, error } = await actionSetCheckInResponseStatus(
                songId,
                0,
                "bad music"
            );
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Set Check in Response Status",
                description: `Successfully set the check in response status to ignore`,
            }),
        onError: (_) =>
            toast({
                title: "Set Check in Response Status",
                description: `Failed to set the check in response status to ignore`,
                variant: "destructive",
            }),
    });

    return (
        <ConfirmationModal
            triggerTitle="Ignore"
            title="Bad Music"
            description="Mark as bad music?"
            content="WARNING: marking this campaign as BAD MUSIC will complete this campaign and remove the artist from playlists. If this artist is good, YOU MUST re-add to playlists. Our team regularly reviews campaigns marked as ‘BAD MUSIC’."
            onConfirm={() => setBadMusicStatus.mutate()}
            isPending={setBadMusicStatus.isPending}
        />
    );
}

export function BadMusicEmailModal({
    songId,
    songName,
    orderNumber,
    email,
    firstName,
}: {
    songId: string;
    songName: string;
    orderNumber: bigint;
    email: string;
    firstName: string;
}) {
    const { toast } = useToast();
    const { defaultName, defaultTitle } = usePlaylistingStore();
    const form = useForm<z.infer<typeof badMusicSchema>>({
        resolver: zodResolver(badMusicSchema),
        defaultValues: {
            email,
            firstName,
            name: defaultName,
            title: defaultTitle,
        },
    });
    const sendBadMusicEmail = useMutation({
        mutationKey: [songId, "bad-music-email"],
        mutationFn: async (values: z.infer<typeof badMusicSchema>) => {
            const { data, error } = await actionSendBadMusicEmail({
                email: values.email,
                firstName: values.firstName,
                orderNumber,
                supportName: values.name,
                supportTitle: values.title,
            });
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Bad Music Email",
                description: `Successfully sent a bad music email to ${form.getValues(
                    "email"
                )} for order changed order status for order #${orderNumber.toString()}`,
            }),
        onError: (e) =>
            toast({
                title: "Song Status",
                description: `Failed to change order status for order #${orderNumber.toString()} due to the following error: ${
                    e.message
                }`,
                variant: "destructive",
            }),
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Bad music email</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Send Bad Music Email</DialogTitle>
                    <DialogDescription>
                        Song Name: {songName}, Order number:{" "}
                        {Number(orderNumber)}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            (values: z.infer<typeof badMusicSchema>) =>
                                sendBadMusicEmail.mutate(values)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Order Email
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Order First Name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Your name, who is deciding it&apos;s bad
                                        music :(
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Title (Role)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Your role, as the person deciding
                                        it&apos;s bad music :(
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={sendBadMusicEmail.isPending}
                        >
                            {sendBadMusicEmail.isPending ? (
                                <Spinner />
                            ) : (
                                "Send bad music email"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function FulfillmentTableActions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-4 shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText("hello world")}
                >
                    Copy text
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function UpgradeCampaignStatus({
    orderNumber,
    orderStatus,
}: {
    orderNumber: bigint;
    orderStatus: PlaylistPromoEnumType;
}) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(orderStatus);
    const { toast } = useToast();
    const changeStatus = useMutation({
        mutationKey: [orderNumber.toString(), "status"],
        mutationFn: async (newStatus: PlaylistPromoEnumType) => {
            const { data, error } = await actionUpgradeOrderStatus(
                orderNumber,
                newStatus
            );
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Song Status",
                description: `Successfully changed order status for order #${orderNumber.toString()}`,
            }),
        onError: (e) =>
            toast({
                title: "Song Status",
                description: `Failed to change order status for order #${orderNumber.toString()} due to the following error: ${
                    e.message
                }`,
                variant: "destructive",
            }),
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[150px] justify-between"
                >
                    {PlaylistPromoEnumSchema.options
                        ? PlaylistPromoEnumSchema.options.find(
                              (s) => status === s
                          )
                        : "select status"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-0">
                <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                        <CommandEmpty>No status type found</CommandEmpty>
                        <CommandGroup>
                            {PlaylistPromoEnumSchema.options.map((s) => (
                                <CommandItem
                                    key={s}
                                    value={s}
                                    onSelect={(current) => {
                                        if (current !== status) {
                                            setStatus(
                                                current as PlaylistPromoEnumType
                                            );
                                            changeStatus.mutateAsync(
                                                current as PlaylistPromoEnumType
                                            );
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    {s}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            status === s
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function SortingAction({
    accessorKey,
    onClickAsc,
    onClickDesc,
}: {
    accessorKey: string;
    onClickAsc: () => void;
    onClickDesc: () => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="my-1 w-full p-0">
                    {accessorKey}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={onClickAsc}
                    className="flex items-center gap-2"
                >
                    <ArrowUp className="size-4 shrink-0" /> Asc
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onClickDesc}
                    className="flex items-center gap-2"
                >
                    <ArrowDown className="size-4 shrink-0" /> Desc
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function SpotifyPlayer({ spotifyId }: { spotifyId: string }) {
    const [playerOpen, setPlayerOpen] = useState(false);
    return playerOpen ? (
        <Card
            className="flex justify-center"
            onClick={() => setPlayerOpen(!playerOpen)}
        >
            <iframe
                src={`https://open.spotify.com/embed/track/${spotifyId}`}
                loading="lazy"
                allow="encrypted-media"
                className="h-20 w-auto rounded-xl"
                title="Spotify Player"
            />
        </Card>
    ) : (
        <Button
            variant="secondary"
            onClick={(e) => {
                e.preventDefault();
                setPlayerOpen(!playerOpen);
            }}
        >
            Load player
        </Button>
    );
}

export function UpdateSpotifyId({
    songId,
    spotifyId,
}: {
    songId: string;
    spotifyId: string;
}) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof spotifyIdSchema>>({
        resolver: zodResolver(spotifyIdSchema),
        defaultValues: {
            spotifyId,
        },
    });
    const updateSpotifyId = useMutation({
        mutationKey: [songId, "edit spotify id"],
        mutationFn: async ({ spotifyId }: z.infer<typeof spotifyIdSchema>) => {
            const parsed = parseSpotifyId(spotifyId);
            if (parsed) throw new Error("failed to parse spotify id");
            const { data, error } = await actionUpdateSongSpotifyId(
                songId,
                parsed
            );
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Update Spotify Id",
                description: `Successfully updated the spotify id of song with id ${songId}`,
            }),
        onError: (_) =>
            toast({
                title: "Update Spotify Id",
                description: `Failed to update the spotify id of song with id ${songId}`,
                variant: "destructive",
            }),
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{spotifyId}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Update Spotify Id</DialogTitle>
                    <DialogDescription>
                        Enter a different spotify id for this order&apos;s
                        artist
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(
                                (values: z.infer<typeof spotifyIdSchema>) =>
                                    updateSpotifyId.mutate(values)
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="spotifyId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Edit Spotify Id</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Edit the spotify id for loading this
                                            order&apos; song to maybe load. You
                                            can enter a url or an ID.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={updateSpotifyId.isPending}
                            >
                                {updateSpotifyId.isPending ? (
                                    <Spinner />
                                ) : (
                                    "Change Id"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function UpdateEmail({
    orderNumber,
    email,
}: {
    orderNumber: bigint;
    email: string;
}) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email,
        },
    });
    const updateEmail = useMutation({
        mutationKey: [Number(orderNumber), "update-email"],
        mutationFn: async (values: z.infer<typeof emailSchema>) => {
            const { data, error } = await actionUpdateOrderEmail(
                orderNumber,
                values.email
            );
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Update Order Email",
                description: `Successfully updated the order email for order number ${Number(
                    orderNumber
                )}`,
            }),
        onError: (_) =>
            toast({
                title: "Update Spotify Id",
                description: `Failed to update email for order number ${Number(
                    orderNumber
                )}`,
                variant: "destructive",
            }),
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{email}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Email</DialogTitle>
                    <DialogDescription>
                        Enter the email that the order should be associated with
                    </DialogDescription>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(
                                (values: z.infer<typeof emailSchema>) =>
                                    updateEmail.mutate(values)
                            )}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            email order should be associated
                                            with
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={updateEmail.isPending}
                            >
                                {updateEmail.isPending ? (
                                    <Spinner />
                                ) : (
                                    "Update Email"
                                )}
                            </Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export function CheckIn({
    songId,
    orderNumber,
    orderIndex,
    priority,
}: {
    songId: string;
    orderNumber: bigint;
    orderIndex: number;
    priority: number;
}) {
    const { specialModifier } = usePlaylistingStore();
    const pathname = usePathname();
    const baseURL = pathname.includes("boost-admin")
        ? "/boost-admin"
        : "/support-admin";
    const orderId = `${orderNumber}-${orderIndex}`;
    const filter = specialModifier === "power upgrade" && "power-upgrade";

    if (priority === 1)
        return (
            <div className="flex flex-col gap-2">
                <Link
                    className={cn(buttonVariants())}
                    href={
                        filter
                            ? `${baseURL}/playlisting/${orderId}?filter=${filter}?checkin=${songId}`
                            : `${baseURL}/playlisting/${orderId}?checkin=${songId}`
                    }
                >
                    Resolve
                </Link>
                <IgnoreModal songId={songId} />
            </div>
        );

    if (priority === 2)
        return (
            <div className="flex flex-col gap-2">
                <Link
                    className={cn(buttonVariants())}
                    href={
                        filter
                            ? `${baseURL}/playlisting/${orderId}?filter=${filter}?checkin=${songId}`
                            : `${baseURL}/playlisting/${orderId}?checkin=${songId}`
                    }
                >
                    Resolve
                </Link>
                <BadMusicModal songId={songId} />
            </div>
        );

    return null;
}

export function Action({
    orderNumber,
    orderIndex,
    songStatus,
    spotifyId,
}: {
    orderNumber: bigint;
    orderIndex: number;
    songStatus: PlaylistPromoEnumType;
    spotifyId: string;
}) {
    const pathname = usePathname();
    const baseURL = pathname.includes("boost-admin")
        ? "/boost-admin"
        : "/support-admin";
    const { specialModifier } = usePlaylistingStore();
    const orderId = `${Number(orderNumber)}-${orderIndex}`;
    const filter = specialModifier === "power upgrade" ? "power upgrade" : "";

    if (songStatus === "pending" && spotifyId)
        return (
            <Link
                href={
                    filter
                        ? `${baseURL}/playlisting/${orderId}?filter=${filter}`
                        : `${baseURL}/playlisting/${orderId}`
                }
                className={cn(buttonVariants())}
            >
                fulfill
            </Link>
        );

    if (songStatus === "playlisted" && spotifyId)
        return (
            <Link
                href={
                    filter
                        ? `${baseURL}/playlisting/${orderId}?filter=${filter}`
                        : `${baseURL}/playlisting/${orderId}`
                }
                className={cn(buttonVariants())}
            >
                check playlists
            </Link>
        );

    return null;
}

export function AddNote({ songId, notes }: { songId: string; notes: string }) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            note: notes,
        },
    });
    const addNote = useMutation({
        mutationKey: [songId, "add-note"],
        mutationFn: async (values: z.infer<typeof noteSchema>) => {
            const { data, error } = await actionAddNoteToSong(
                songId,
                values.note
            );
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Add Note",
                description: `Successfully added note to the song with id = ${songId}`,
            }),
        onError: (_) =>
            toast({
                title: "Update Spotify Id",
                description: `Failed to add note to the song with id = ${songId}`,
                variant: "destructive",
            }),
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    {notes && notes !== ""
                        ? notes.split(" ").slice(0, 5).join(" ").slice(0, 25)
                        : "add note"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Note</DialogTitle>
                    <DialogDescription>
                        Add any note to help others who are fulfilling!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(
                            (values: z.infer<typeof noteSchema>) =>
                                addNote.mutate(values)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={addNote.isPending}>
                            {addNote.isPending ? <Spinner /> : "Add Note"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function Streams({
    songId,
    artistId,
    spotifyId,
    originalStreams,
    originalStreamsDate,
}: {
    songId: string;
    artistId: string;
    spotifyId: string;
    originalStreams?: number;
    originalStreamsDate?: string;
}) {
    const { toast } = useToast();
    const updateStreamCount = useMutation({
        mutationKey: [songId, "stream-count"],
        mutationFn: async () => {
            const getStreams = await fetch(
                `/api/spotify/streams/${artistId}?code=boost&trackId=${spotifyId}`,
                {
                    next: { revalidate: 86400 },
                    cache: "force-cache",
                }
            );
            if (!getStreams?.ok) throw new Error("Error updating streams.");
            const currentDate = moment().format("YYYY-MM-DD");
            const streamCountObj = await getStreams
                .json()
                .then((res) => res.data as { streamCount: number });
            if (!originalStreams) {
                const { error } = await actionUpdateStreamsCount(
                    songId,
                    streamCountObj.streamCount,
                    currentDate
                );
                if (error) throw error;
            }
            return {
                addedStreams: originalStreams ?? streamCountObj.streamCount,
                addedStreamsDate: originalStreamsDate ?? currentDate,
            };
        },
        onSuccess: (_) =>
            toast({
                title: "Stream Count",
                description: `Successfully updated retrieve stream count for song with id = ${songId}`,
                variant: "destructive",
            }),
        onError: (_) =>
            toast({
                title: "Stream Count",
                description: `Failed to retrieve stream count for song with id = ${songId}`,
                variant: "destructive",
            }),
    });

    return !originalStreams ? (
        <Button
            onClick={(e) => {
                e.preventDefault();
                updateStreamCount.mutate();
            }}
            variant="secondary"
        >
            Update StreamCount
        </Button>
    ) : (
        <div className="truncate">
            {updateStreamCount.isPending ? (
                <Skeleton className="h-2 w-full" />
            ) : updateStreamCount.isError ? (
                "failed to retrieve stream count"
            ) : (
                <>
                    <p>
                        Start: {originalStreamsDate?.slice(5)} &gt;&gt;{" "}
                        {originalStreamsDate && (
                            <span>{originalStreams ?? "NA"}</span>
                        )}
                    </p>
                    <p>
                        Gained:{" "}
                        {updateStreamCount?.data?.addedStreamsDate?.slice(5) ??
                            "NA"}{" "}
                        &gt;&gt;{" "}
                        {originalStreamsDate && (
                            <span>
                                {originalStreams
                                    ? `+${
                                          (updateStreamCount?.data
                                              ?.addedStreams ?? 0) -
                                          originalStreams
                                      }`
                                    : "NA"}
                            </span>
                        )}
                    </p>
                </>
            )}
        </div>
    );
}

export function UpgradePlaylistSongStatus({
    songId,
    songStatus,
}: {
    songId: string;
    songStatus: PlaylistPromoEnumType;
}) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(songStatus);
    const { toast } = useToast();
    const changeStatus = useMutation({
        mutationKey: [songId, "status"],
        mutationFn: async (newStatus: PlaylistPromoEnumType) => {
            const { data, error } = await actionUpgradePlaylistSongStatus(
                songId,
                newStatus
            );
            if (error) throw error;
            return data;
        },
        onSuccess: (_) =>
            toast({
                title: "Song Status",
                description: `Successfully changed order status for song with id ${songId}`,
            }),
        onError: (e) =>
            toast({
                title: "Song Status",
                description: `Failed to change order status for song with id ${songId} due to the following error: ${e.message}`,
                variant: "destructive",
            }),
    });

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[150px] justify-between"
                >
                    {PlaylistPromoEnumSchema.options
                        ? PlaylistPromoEnumSchema.options.find(
                              (s) => status === s
                          )
                        : "select status"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-0">
                <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                        <CommandEmpty>No status type found</CommandEmpty>
                        <CommandGroup>
                            {PlaylistPromoEnumSchema.options.map((s) => (
                                <CommandItem
                                    key={s}
                                    value={s}
                                    onSelect={(current) => {
                                        if (current !== status) {
                                            setStatus(
                                                current as PlaylistPromoEnumType
                                            );
                                            changeStatus.mutateAsync(
                                                current as PlaylistPromoEnumType
                                            );
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    {s}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            status === s
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
