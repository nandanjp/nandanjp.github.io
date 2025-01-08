"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { docsConfig, siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { AlignJustifyIcon } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ModeToggle } from "./mode-toggle";

export function MobileNav() {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <AlignJustifyIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex h-full flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between pt-6">
                        <MobileLink
                            href="/"
                            className="flex items-center"
                            onOpenChange={setOpen}
                        >
                            <span className="text-lg font-bold">
                                {siteConfig.name}
                            </span>
                        </MobileLink>
                        <ModeToggle />
                    </SheetTitle>
                </SheetHeader>
                <div className="flex h-full w-full flex-1 flex-col">
                    {docsConfig.sidebarNav.map((item) => (
                        <Link
                            href={item.href}
                            className={cn(
                                buttonVariants({ variant: "link" }),
                                "w-fit"
                            )}
                            key={item.href}
                        >
                            {item.title}
                        </Link>
                    ))}
                    <div className="flex w-full items-center justify-end gap-2"></div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

function MobileLink({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    const router = useRouter();

    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString());
                onOpenChange?.(false);
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    );
}
