import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data: sessions } = await supabase
      .from("sessions")
      .select("user_id")
      .eq("token", sessionToken)
      .single();

    if (!sessions) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, email, display_name")
      .eq("id", sessions.user_id)
      .single();

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
