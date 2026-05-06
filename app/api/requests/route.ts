import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { User } from "@/lib/types";
import { signToken } from "@/lib/auth";
export const runtime = "nodejs";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
function tripleEncode(input: string): string {
  return btoa(btoa(btoa(input)));
}
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reqType = searchParams.get("type");

  if (reqType === "login") {
    const filePath = path.join(process.cwd(), "public", "data", "users.json");

    const fileData = fs.readFileSync(filePath, "utf-8");
    const users: User[] = JSON.parse(fileData);

    const { username, password } = await req.json();

    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    const cookieStore = await cookies();
    const kill = tripleEncode("paramz");
    cookieStore.set(kill, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return NextResponse.json({ message: "Login successful" });
  } else if (reqType === "logout") {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return NextResponse.json({ message: "Logged out" });
  }
}