import Link from "next/link";
import React from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { docsConfig, siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

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
                        <NavigationMenuItem key={item.trigger}>
                            <NavigationMenuTrigger>
                                {item.trigger}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid grid-cols-2 gap-2 p-4 md:w-[300px] lg:w-[400px]">
                                    {item.items.map((i) => (
                                        <ListItem
                                            key={i.title}
                                            href={i.href}
                                            title={i.title}
                                        >
                                            {i.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
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
