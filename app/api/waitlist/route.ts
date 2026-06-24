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
    const { email, source } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const finalSource = source || "direct";

    const { data, error } = await supabase
      .from("waitlist")
      .insert({ email, source: finalSource })
      .select();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { status: "duplicate", message: "Email already on waitlist" },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { status: "success", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to submit waitlist" },
      { status: 500 }
    );
  }
}