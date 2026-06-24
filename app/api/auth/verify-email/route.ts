import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { detail: "Missing token" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .update({ email_verified: true, verification_token: null })
      .eq("verification_token", token)
      .select()
      .single();

    if (error || !user) {
      return NextResponse.json(
        { detail: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { user: { id: user.id, email: user.email, display_name: user.display_name } },
      { status: 200 }
    );

    const sessionToken = Buffer.from(Math.random().toString()).toString("base64");
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { detail: "Verification failed" },
      { status: 500 }
    );
  }
}