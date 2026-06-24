import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const sessionSecret = process.env.SESSION_SECRET || "secret";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Missing email or password" },
        { status: 400 }
      );
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password_hash", passwordHash)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { detail: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.email_verified) {
      return NextResponse.json(
        { detail: "email_not_verified" },
        { status: 403 }
      );
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, display_name: user.display_name } },
      { status: 200 }
    );

    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { detail: "Login failed" },
      { status: 500 }
    );
  }
}