declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      NODE_ENV: "development" | "production";
      NEXT_PUBLIC_API_URL: string;
    }
  }
}

export {};
