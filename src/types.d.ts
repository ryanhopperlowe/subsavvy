declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      NODE_ENV: "development" | "production";
      NEXT_PUBLIC_API_URL: string;
      MYSQL_HOST: string;
      MYSQL_PORT: string;
      MYSQL_DATABASE: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
    }
  }
}

export {};
