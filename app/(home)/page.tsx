import { Icons } from "@/components/common/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    TypographyH1,
    TypographyH2,
    TypographyH4,
    TypographyMuted,
    TypographyP,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ArrowRight, BookUser, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const skills = [
    "rust",
    "golang",
    "typescript",
    "python",
    "swift",
    "haskell",
    "zig",
    "c#",
    "c++",
    "grpc",
    "docker",
    "rabbitmq",
    "neo4j",
    "nextjs",
    "postgres",
    "mongodb",
] as const;

const technologies = [
    { name: "vercel", href: "https://vercel.com/" },
    { name: "netlify", href: "https://www.netlify.com/" },
    { name: "supabase", href: "https://supabase.com/" },
    { name: "resend", href: "https://resend.com/" },
    { name: "tanstack-start", href: "https://tanstack.com/start/latest" },
    { name: "better-auth", href: "https://www.better-auth.com/" },
    { name: "drizzle-orm", href: "https://orm.drizzle.team/" },
    { name: "clerk", href: "https://clerk.com/" },
    { name: "arcjet", href: "https://arcjet.com/" },
    { name: "upstash", href: "https://upstash.com/" },
    { name: "hono", href: "https://hono.dev/" },
    { name: "trpc", href: "https://trpc.io/" },
] as const;

export default function Home() {
    return (
        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center container max-w-screen-lg mx-auto">
            <div className="grid lg:grid-cols-2 items-center justify-items-center gap-4">
                <div className="flex flex-col gap-4 max-w-screen-md items-center">
                    <div className="flex flex-col items-center">
                        <TypographyH2 className="tracking-tighter font-extrabold text-center text-balance">
                            Nandan Patel - Fullstack and Aspiring Game Developer
                        </TypographyH2>
                        <TypographyH4 className="text-muted-foreground text-center text-balance">
                            <span className="decoration-wavy text-red-400">
                                Physics
                            </span>{" "}
                            and game engines are way cooler, but I enjoy
                            building websites and{" "}
                            <span className="decoration-wavy text-blue-400">
                                architecting
                            </span>{" "}
                            systems{" "}
                            <Icons.chrome className="size-4 resize-none shrink-0 inline" />
                        </TypographyH4>
                    </div>
                    <div className="items-center gap-2 hidden lg:flex">
                        <Link
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "flex items-center gap-1"
                            )}
                            href={"/works"}
                        >
                            View Works{" "}
                            <List className="size-4 shrink-0 resize-none" />
                        </Link>
                        <Link
                            className={cn(
                                buttonVariants({ variant: "secondary" }),
                                "flex items-center gap-1"
                            )}
                            href={"/resume"}
                        >
                            View Resume{" "}
                            <BookUser className="size-4 shrink-0 resize-none" />
                        </Link>
                    </div>
                </div>
                <Card className="drop-shadow-sm max-w-xl">
                    <Image
                        src={"/images/content/haikyuu.jpeg"}
                        alt="profile-image"
                        width={960}
                        height={540}
                        className="object-contain rounded-lg"
                    />
                </Card>
                <div className="flex items-center gap-2 lg:hidden">
                    <Link
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "flex items-center gap-1"
                        )}
                        href={"/works"}
                    >
                        View Works{" "}
                        <List className="size-4 shrink-0 resize-none" />
                    </Link>
                    <Link
                        className={cn(
                            buttonVariants({ variant: "secondary" }),
                            "flex items-center gap-1"
                        )}
                        href={"/resume"}
                    >
                        View Resume{" "}
                        <BookUser className="size-4 shrink-0 resize-none" />
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-8 w-full">
                <TypographyH1>Work Experience + Education</TypographyH1>
            </div>
            <div className="flex flex-col gap-8 w-full">
                <div className="flex items-center justify-between gap-4 w-full">
                    <TypographyH1>Projects</TypographyH1>
                    <Link
                        href={"/projects"}
                        className={cn(buttonVariants(), "group")}
                    >
                        See All{" "}
                        <ArrowRight className="size-4 resize-none shrink-0 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-items-center">
                    {[1, 2, 3, 4, 5, 6].map((project) => (
                        <Card key={`project-${project}`} className="max-w-sm">
                            <Card className="mb-2">
                                <Image
                                    src={"/images/content/haikyuu.jpeg"}
                                    alt="profile-image"
                                    width={960}
                                    height={540}
                                    className="object-contain rounded-lg"
                                />
                            </Card>
                            <CardContent className="px-4">
                                <TypographyH4>Project 1</TypographyH4>
                                <TypographyMuted>
                                    April 2024 - March 2024
                                </TypographyMuted>
                                <TypographyP className="leading-tight my-0">
                                    Developed an AI Customer Support Chatbot
                                    which automatically responds to customer
                                    support tickets using the latest GPT models.
                                </TypographyP>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4 items-start p-4 pt-0">
                                <div className="flex items-center gap-1 flex-wrap">
                                    {skills.slice(12).map((skill) => (
                                        <Badge
                                            variant={"secondary"}
                                            key={skill}
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`https://github.com`}
                                        className={cn(
                                            buttonVariants({
                                                variant: "default",
                                            }),
                                            "group relative"
                                        )}
                                    >
                                        <Icons.gitHub className="size-4 shrink-0 resize-none inline" />{" "}
                                        Source
                                    </Link>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4 justify-items-center">
                <div className="flex flex-col items-center gap-4">
                    <TypographyH1 className="text-blue-400">
                        Skills
                    </TypographyH1>
                    <TypographyH4 className="font-normal text-muted-foreground text-center text-balance">
                        I love learning new languages and tools, especially
                        those that require me to change my way of thinking. Here
                        are examples of some of these tools that I&apos; picked
                        up as a result:
                    </TypographyH4>
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                        {skills.map((skill) => (
                            <Badge variant={"secondary"} key={skill}>
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <TypographyH1 className="text-blue-800">
                        Technology
                    </TypographyH1>
                    <TypographyH4 className="font-normal text-muted-foreground text-center text-balance">
                        Along with generic tools, I love learning from and
                        ultimately using well-built abstractions. This has
                        become increasingly common especially in Fullstack, and
                        so here are a few of my favourite software services:
                    </TypographyH4>
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                        {technologies.map((technology) => (
                            <Link
                                key={technology.name}
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "group relative"
                                )}
                                href={technology.href}
                            >
                                <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                                    {technology.name}
                                </span>
                                <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                    <span>visit</span>
                                    <ArrowRight />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
