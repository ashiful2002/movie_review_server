import crypto from "crypto";
import { redisService } from "./radis";

export function buildCacheKey(prefix: string, ...parts: (string | number)[]): string {
  const raw = parts.join(":");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return `${prefix}:${hash}`;
}
 
export async function withCache<T>(
  cacheKey: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<{ data: T; fromCache: boolean }> {
  try {
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return { data: JSON.parse(cached as string), fromCache: true };
    }
  } catch (error) {
    console.warn(`cache read error: ${error}`);
  }

  const data = await fetcher();

  try {
    await redisService.set(cacheKey, JSON.stringify(data), ttlSeconds);
  } catch (error) {
    console.warn(`cache write error: ${error}`);
  }

  return { data, fromCache: false };
}
