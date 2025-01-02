"use client";

import { AlignJustifyIcon } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { docsConfig } from "@/lib/config";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

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
                    <SheetTitle></SheetTitle>
                </SheetHeader>
                <MobileLink
                    href="/"
                    className="flex items-center"
                    onOpenChange={setOpen}
                >
                    <span className="text-lg font-bold">Sadmn Rec</span>
                </MobileLink>
                <div className="flex h-full w-full flex-1 flex-col">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full flex-1"
                    >
                        {docsConfig.sidebarNav.map((item) => (
                            <AccordionItem key={item.title} value={item.title}>
                                <AccordionTrigger>
                                    {item.title}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground flex flex-col justify-center gap-2">
                                    {item.items.map((i) => (
                                        <Link
                                            href={i.href}
                                            className="hover:text-foreground transition-all duration-75 ease-in"
                                            key={i.href}
                                        >
                                            {i.title}
                                        </Link>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <div className="flex w-full items-center justify-end gap-2">
                        <ModeToggle />
                    </div>
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
