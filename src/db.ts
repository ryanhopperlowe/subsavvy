import mysql from "serverless-mysql";

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

export type Query = {
  query: string;
  values?: any[];
};

export async function excuteQuery<T = unknown>({
  query,
  values,
}: Query): Promise<{
  results?: T;
  error?: unknown;
}> {
  try {
    db.connect();
    const results: T = await db.query(query, values);
    await db.end();
    return { results };
  } catch (error) {
    return { error };
  }
}
