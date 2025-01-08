import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { docsConfig, siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export function MainNav() {
    return (
        <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/" className="flex items-center">
                <span className="hidden font-bold lg:inline-block">
                    {siteConfig.name}
                </span>
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    {docsConfig.mainNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                {item.title}
                            </NavigationMenuLink>
                        </Link>
                    ))}
                    <NavigationMenuItem></NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
