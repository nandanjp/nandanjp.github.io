export const siteConfig = {
    name: "nandanjp/todo",
    url: "localhost:3000",
    description: "Just a typical, simple Todo Application you know?",
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
    mainNav: MainNavItem[];
    sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
    mainNav: [
        {
            trigger: "Lobby",
            items: [
                {
                    title: "Products",
                    href: "/product",
                    description: "All products offerred",
                },
                {
                    title: "Shoes",
                    href: "/shoes",
                    description: "Browse shoes LOLL.",
                },
                {
                    title: "Clothing",
                    href: "/clothing",
                    description: "Browse clothing LOLL.",
                },
                {
                    title: "Blog",
                    href: "/blog",
                    description: "Read up on stuff.",
                },
            ],
        },
        {
            trigger: "Shoes",
            items: [
                {
                    title: "All",
                    href: "/shoes",
                    description: "All shoes that are currently being sold",
                },
                {
                    title: "Low Tops",
                    href: `/shoes?type="low-tops"`,
                    description: "Discover all low top shoes being offered",
                },
                {
                    title: "High Tops",
                    href: `/shoes?type="high-tops"`,
                    description: "Discover all high top shoes being offered",
                },
                {
                    title: "Slip-ons",
                    href: `/shoes?type="slip-ons"`,
                    description: "Discover all slip-ons being offered",
                },
            ],
        },
        {
            trigger: "Clothing",
            items: [
                {
                    title: "All",
                    href: "/clothing",
                    description: "All clothing that are currently being sold",
                },
                {
                    title: "T-shirts",
                    href: `/clothing?type="t-shirts"`,
                    description: "Discover all t-shirts being offered",
                },
                {
                    title: "Hoodies",
                    href: `/clothing?type="hoodies"`,
                    description: "Discover all hoodies being offered",
                },
                {
                    title: "Pants",
                    href: `/clothing?type="pants"`,
                    description: "Discover all pants being offered",
                },
            ],
        },
    ],
    sidebarNav: [
        {
            title: "Lobby",
            items: [
                {
                    title: "Products",
                    href: "/product",
                    items: [],
                },
                {
                    title: "Shoes",
                    href: "/shoes",
                    items: [],
                },
                {
                    title: "Clothing",
                    href: "/clothing",
                    items: [],
                },
                {
                    title: "Blog",
                    href: "/blog",
                    items: [],
                },
            ],
        },
        {
            title: "Shoes",
            items: [
                {
                    title: "All",
                    href: "/shoes",
                    items: [],
                },
                {
                    title: "Low Tops",
                    href: `/shoes?type="low-tops"`,
                    items: [],
                },
                {
                    title: "High Tops",
                    href: `/shoes?type="high-tops"`,
                    items: [],
                },
                {
                    title: "Slip-ons",
                    href: `/shoes?type="slip-ons"`,
                    items: [],
                },
            ],
        },
        {
            title: "Clothing",
            items: [
                {
                    title: "All",
                    href: "/clothing",
                    items: [],
                },
                {
                    title: "T-shirts",
                    href: `/clothing?type="t-shirts"`,
                    items: [],
                },
                {
                    title: "Hoodies",
                    href: `/clothing?type="hoodies"`,
                    items: [],
                },
                {
                    title: "Pants",
                    href: `/clothing?type="pants"`,
                    items: [],
                },
            ],
        },
    ],
};

export const Footer = [
    {
        section: "Credits",
        items: [
            "OneStopShop",
            "Acme Corp",
            "craft.mxkaske.dev",
            "Taxonomy",
            "shadcn/ui",
        ],
    },
    {
        section: "Help",
        items: ["About", "Contact", "Terms", "Privacy"],
    },
    {
        section: "Social",
        items: ["X", "GitHub", "Discord", "cat.com"],
    },
    {
        section: "Lofi",
        items: [
            "beats to study to",
            "beats to chill to",
            "a fresh start",
            "coffee to go",
        ],
    },
];
