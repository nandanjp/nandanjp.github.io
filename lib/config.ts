export const siteConfig = {
    name: "Nandan",
    url: "localhost:3000",
    description: "Nandan's personal website",
    links: {
        twitter: "https://twitter.com/",
        github: "https://github.com/nandanjp",
    },
};

interface NavItem {
    title: string;
    href: string;
    description: string;
}

export interface MainNavItem {
    trigger: string;
    items: NavItem[];
}

interface RecursiveSidebarNavItem {
    title: string;
    href: string;
    items: RecursiveSidebarNavItem[];
}

export interface SidebarNavItem {
    title: string;
    items: RecursiveSidebarNavItem[];
}

export interface DocsConfig {
    mainNav: { title: string; href: string }[];
    sidebarNav: { title: string; href: string }[];
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            title: "Blog",
            href: "/blog",
        },
        {
            title: "Works",
            href: "/works",
        },
        {
            title: "Resume",
            href: "/resume",
        },
    ],
    sidebarNav: [
        {
            title: "Blog",
            href: "/blog",
        },
        {
            title: "Works",
            href: "/works",
        },
        {
            title: "Resume",
            href: "/resume",
        },
    ],
};

export const Footer = [
    {
        section: "Credits",
        items: [
            "shadcn/ui",
            "supabase",
            "resend",
            "upstash",
            "drizzle",
            "trpc",
        ],
    },
    {
        section: "Social",
        items: ["X", "GitHub", "Discord", "LinkedIn"],
    },
];
