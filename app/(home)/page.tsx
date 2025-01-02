import { Icons } from "@/components/common/icons";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    "postgres",
    "mongodb",
] as const;

const technologies = [
    { name: "vercel", href: "https://vercel.com/" },
    { name: "supabase", href: "https://supabase.com/" },
    { name: "resend", href: "https://resend.com/" },
    { name: "nextjs", href: "https://nextjs.org/" },
    { name: "tanstack-start", href: "https://tanstack.com/start/latest" },
    { name: "drizzle-orm", href: "https://orm.drizzle.team/" },
    { name: "clerk", href: "https://clerk.com/" },
    { name: "arcjet", href: "https://arcjet.com/" },
    { name: "upstash", href: "https://upstash.com/" },
    { name: "trpc", href: "https://trpc.io/" },
] as const;

const experiences = [
    {
        company: "Boost Collective",
        time: "Sept 2024 - Current",
        description:
            "At Boost Collective, I was provided with the opportunity to truly improve my abilities and understanding as a fullstack engineer, as I was tasked with improving site speed, implementing backend related features and altogether elevating developer experience by integrating well developed tools in the fullstack landscape. It has elevated my every developer abilities to the greatest extent.",
    },
    {
        company: "Dandelion Networks",
        time: "Jan 2024 - April 2024",
        description:
            "Being provided with the chance to utilize golang and grpc architecture, I was able to gain experience working on real world backend systems that required to be concurrent and compliant with commonly used protocols such as grpc and protobufs. My experience at Dandelion Networks also allowed me to gain a better understanding of the overall crypto industry, as I had the opportunity to work on their core blockchain system.",
    },
] as const;

export default function Home() {
    return (
        <div className="flex flex-col gap-8 md:gap-16 lg:gap-24 items-center container max-w-screen-lg mx-auto">
            <div className="grid lg:grid-cols-2 items-center justify-items-center gap-4">
                <div className="flex flex-col gap-4 max-w-screen-md items-center">
                    <div className="flex flex-col">
                        <TypographyH1 className="text-red-400 text-center lg:text-start">
                            Nandan Patel
                        </TypographyH1>
                        <TypographyH2 className="tracking-tighter font-extrabold text-balance text-center lg:text-start">
                            Fullstack and Aspiring Game Developer
                        </TypographyH2>
                        <TypographyH4 className="text-muted-foreground text-balance mt-2 text-center lg:text-start">
                            <span className="decoration-wavy text-red-400">
                                Physics
                            </span>{" "}
                            and game engines are way cooler, but I enjoy
                            building websites and{" "}
                            <span className="decoration-wavy text-blue-400">
                                architecting
                            </span>{" "}
                            systems
                        </TypographyH4>
                    </div>
                    <div className="gap-4 hidden lg:flex lg:justify-start w-full">
                        <Link
                            className={cn(
                                buttonVariants({
                                    variant: "default",
                                    size: "lg",
                                }),
                                "flex items-center gap-1"
                            )}
                            href={"/works"}
                        >
                            View Works{" "}
                            <List className="size-4 shrink-0 resize-none" />
                        </Link>
                        <Link
                            className={cn(
                                buttonVariants({
                                    variant: "secondary",
                                    size: "lg",
                                }),
                                "flex items-center gap-1"
                            )}
                            href={"/resume"}
                        >
                            View Resume{" "}
                            <BookUser className="size-4 shrink-0 resize-none" />
                        </Link>
                    </div>
                </div>
                <BackgroundGradient containerClassName="max-w-lg">
                    <Image
                        src={"/images/content/haikyuu.jpeg"}
                        alt="profile-image"
                        width={960}
                        height={540}
                        className="object-contain rounded-lg"
                    />
                </BackgroundGradient>
                <div className="flex items-center gap-2 lg:hidden">
                    <Link
                        className={cn(
                            buttonVariants({ variant: "default", size: "lg" }),
                            "flex items-center gap-1"
                        )}
                        href={"/works"}
                    >
                        View Works{" "}
                        <List className="size-4 shrink-0 resize-none" />
                    </Link>
                    <Link
                        className={cn(
                            buttonVariants({
                                variant: "secondary",
                                size: "lg",
                            }),
                            "flex items-center gap-1"
                        )}
                        href={"/resume"}
                    >
                        View Resume{" "}
                        <BookUser className="size-4 shrink-0 resize-none" />
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-items-center">
                <Card className="max-w-sm size-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-1 flex-wrap justify-center">
                        {skills.map((skill) => (
                            <Badge variant={"secondary"} key={skill}>
                                {skill}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>
                <Card className="max-w-sm size-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Technologies</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-1 flex-wrap justify-center">
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
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 size-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Experiences</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-1 flex-wrap justify-center">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full max-w-screen-md mx-auto"
                        >
                            {experiences.map((experience, i) => (
                                <AccordionItem
                                    key={experience.company}
                                    value={`item-${i + 1}`}
                                >
                                    <AccordionTrigger>
                                        <TypographyH4>
                                            {experience.company} -{" "}
                                            <TypographyMuted className="inline">
                                                {experience.time}
                                            </TypographyMuted>
                                        </TypographyH4>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {experience.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
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
                    {[1, 2, 3].map((project, i) => (
                        <Card
                            key={`project-${project}`}
                            className={cn(
                                "max-w-sm",
                                i === 2 && "md:col-span-2 lg:col-span-1"
                            )}
                        >
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
            <div className="flex flex-col gap-8 w-full">
                <TypographyH1>Hobbies</TypographyH1>
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
        </div>
    );
}
