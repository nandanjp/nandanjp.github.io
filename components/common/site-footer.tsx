import { Icons } from "@/components/common/icons";
import { buttonVariants } from "@/components/ui/button";
import { Footer, siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="mx-auto flex w-full max-w-screen-xl flex-col justify-between gap-6 border-t-2 p-7 md:p-9 lg:px-12 xl:px-16">
            <div className="container grid w-full max-w-screen-2xl grid-cols-2 justify-start gap-12 sm:grid-cols-4 sm:gap-6 md:gap-4">
                {Footer.map((f) => (
                    <ul className="flex flex-col gap-3" key={f.section}>
                        <li className="text-base font-semibold">{f.section}</li>
                        {f.items.map((i) => (
                            <li
                                className="text-muted-foreground text-sm"
                                key={i}
                            >
                                {i}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
            <div className="flex w-full items-center justify-between">
                <p className="text-muted-foreground text-sm leading-7 [&:not(:first-child)]:mt-6">
                    Built by{" "}
                    <span className="text-secondary-foreground">nandanjp</span>
                </p>
                <div className="flex items-center gap-4">
                    <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                size: "icon",
                            })
                        )}
                    >
                        <>
                            <Icons.gitHub className="h-6 w-6" />
                            <span className="sr-only">GitHub</span>
                        </>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
