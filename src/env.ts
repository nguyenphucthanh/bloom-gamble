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
    OPENAI_API_KEY: z.string().optional(),
    SLACK_OAUTH_TOKEN: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_SLACK_OAUTH_TOKEN_HERE"),
        "You forgot to update slack oauth token",
      )
      .optional(),
    SLACK_OAUTH_BOT_TOKEN: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_SLACK_BOT_TOKEN_HERE"),
        "You forgot to update slack oauth bot token",
      )
      .optional(),
    SLACK_WEBHOOK: z
      .string()
      .refine(
        (str) => !str.includes("SLACK_WEBHOOK"),
        "You forgot to update slack oauth bot token",
      )
      .optional(),
    SLACK_USE_WEBHOOK: z.boolean().default(false).optional(),
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
    NEXT_PUBLIC_SITE_URL: z
      .string()
      .refine(
        (str) => !str.includes("localhost"),
        "You forgot to change the site url",
      ),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SLACK_OAUTH_TOKEN: process.env.SLACK_OAUTH_TOKEN,
    SLACK_OAUTH_BOT_TOKEN: process.env.SLACK_OAUTH_BOT_TOKEN,
    SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
    SLACK_USE_WEBHOOK: process.env.SLACK_USE_WEBHOOK === "true",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
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
