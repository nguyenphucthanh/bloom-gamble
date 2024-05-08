import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_POSTGRES_URL_HERE"),
        "You forgot to change the default URL",
      ),
    DIRECT_URL: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_POSTGRES_DIRECT_URL_HERE"),
        "you forgot to add direct url for your postgress db",
      ),
    SLACK_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_SLACK_URL_HERE"),
        "you forgot to add slack services hooks url here",
      ),
    OPENAI_API_KEY: z.string().optional(),
    SLACK_OAUTH_TOKEN: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_SLACK_OAUTH_TOKEN_HERE"),
        "You forgot to update slack oauth token",
      ),
    SLACK_OAUTH_BOT_TOKEN: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_SLACK_BOT_TOKEN_HERE"),
        "You forgot to update slack oauth bot token",
      ),
    SLACK_WEBHOOK: z
      .string()
      .refine(
        (str) => !str.includes("SLACK_WEBHOOK"),
        "You forgot to update slack oauth bot token",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_SUPABASE_URL_HERE"),
        "You forgot to change the supabase url",
      ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_SUPABASE_KEY_HERE"),
        "You forgot to change the supabase anon key",
      ),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    SLACK_URL: process.env.SLACK_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SLACK_OAUTH_TOKEN: process.env.SLACK_OAUTH_TOKEN,
    SLACK_OAUTH_BOT_TOKEN: process.env.SLACK_OAUTH_BOT_TOKEN,
    SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
