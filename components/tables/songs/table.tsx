"use client";

import { DataTable } from "@/components/ui/data-table";
import { AppRouter } from "@/server/routers";
import { inferProcedureOutput } from "@trpc/server";
import { songsColumns } from "./columns";

export function SongsTable({
    rows,
}: {
    rows: inferProcedureOutput<AppRouter["spotify"]["getTracksByIds"]>;
}) {
    return <DataTable columns={songsColumns} data={rows} />;
}
