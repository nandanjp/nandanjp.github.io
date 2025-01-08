import { env } from "@/env";
import { publicProcedure } from "@/server/trpc";
import axios from "axios";
import { z } from "zod";

export const getRepos = publicProcedure.query(async () => {
    const axiosClient = axios.create({
        baseURL: "https://api.github.com",
        headers: {
            Authorization: `Bearer ${env.GITHUB_API_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
    });

    const repos = await axiosClient
        .get("/user/repos", {
            params: {
                visibility: "all",
                sort: "updated",
                per_page: 100,
            },
        })
        .then((res) => res.data)
        .catch((error) => {
            const message = error.response?.data?.message || error.message;
            throw new Error(
                `GitHub API error: ${
                    error.response?.status || "Unknown"
                } ${message}`
            );
        });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return repos.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.updated_at),
        private: repo.private,
    }));
});

export const getRepoLanguages = publicProcedure
    .input(z.object({ repoName: z.string() }))
    .query(async ({ input: { repoName } }) => {
        const axiosClient = axios.create({
            baseURL: "https://api.github.com",
            headers: {
                Authorization: `Bearer ${env.GITHUB_API_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
        });

        const repos = await axiosClient
            .get(`repos/${repoName}/languages`, {
                params: {
                    visibility: "all",
                    sort: "updated",
                    per_page: 100,
                },
            })
            .then((res) => res.data)
            .catch((error) => {
                const message = error.response?.data?.message || error.message;
                throw new Error(
                    `GitHub API error: ${
                        error.response?.status || "Unknown"
                    } ${message}`
                );
            });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return repos.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            createdAt: new Date(repo.created_at),
            updatedAt: new Date(repo.updated_at),
            private: repo.private,
        }));
    });
