import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService {
    private client: RedisClient;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        });
    }

    async getAsync<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async setAsync(key: string, value: any, ttlSeconds?: number): Promise<string> {
        const rs = await this.client.set(key, JSON.stringify(value));
        if (ttlSeconds && ttlSeconds > 0) {
            await this.client.expire(key, ttlSeconds);
        } else {
            await this.client.expire(key, process.env.REDIS_DEFAULT_EXPIRED_TIME || 5 * 60 * 60);
        }
        return rs;
    }

    async removeAsync(key: string): Promise<number> {
        return this.client.del(key);
    }

    async getTTLAsync<T>(pattern: string): Promise<number | null> {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            return this.client.ttl(keys[0])
        }
        return null;
    }

    async findOneByPatternAsync<T>(pattern: string): Promise<T | null> {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            return this.getAsync<T>(keys[0])
        }
        return null;
    }

    async findAllByPatternAsync<T>(pattern: string): Promise<T[] | null> {
        const keys = await this.client.keys(pattern);
        const result: T[] = [];
        for (const key of keys) {
            const value = await this.getAsync<T>(key);
            result.push(value)
        }
        return result;
    }

    async removeAllByPatternAsync(pattern: string){
        const keys = await this.client.keys(pattern);
        for (const key of keys) {
            await this.removeAsync(key);
        }
    }
}