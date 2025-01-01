import { Redis } from "@upstash/redis";

let redis: Redis;
if (process.env.NODE_ENV === "production") redis = Redis.fromEnv();
else {
    const globalConnection = global as typeof globalThis & {
        redis: Redis;
    };

    if (!globalConnection.redis) globalConnection.redis = Redis.fromEnv();
    redis = globalConnection.redis;
}

export default redis;
