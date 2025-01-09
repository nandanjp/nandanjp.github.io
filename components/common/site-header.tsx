import { MainNav } from "@/components/common/navbar";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
    return (
        <header className="border-primary/80 bg-background supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
            <div className="container mx-auto flex h-16 w-full max-w-screen-xl items-center gap-2 px-2 sm:px-4 md:justify-between md:px-6 border-b-[1px]">
                <MainNav />
                <MobileNav />
                <nav className="flex flex-1 items-center justify-end gap-4">
                    <ModeToggle />
                </nav>
            </div>
        </header>
    );
}
