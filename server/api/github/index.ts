import { createTRPCRouter } from "@/server/trpc";
import { getRepoLanguages, getRepos } from "./repo";

export const githubRouter = createTRPCRouter({
    getRepos,
    getRepoLanguages,
});
