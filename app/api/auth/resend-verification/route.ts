import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { detail: "Missing email" },
        { status: 400 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const { error } = await supabase
      .from("users")
      .update({ verification_token: verificationToken })
      .eq("email", email);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { status: "sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { detail: "Failed to resend verification" },
      { status: 500 }
    );
  }
}