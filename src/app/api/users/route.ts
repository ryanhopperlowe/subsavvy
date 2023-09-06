import { excuteQuery } from "@/db";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest) => {
  const { results } = await excuteQuery({ query: "SELECT * FROM users" });

  console.log(results);

  return NextResponse.json({
    users: results,
  });
};

export { GET };
