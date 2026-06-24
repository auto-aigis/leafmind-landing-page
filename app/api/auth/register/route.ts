import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const webhookUrl = process.env.PLATFORM_WEBHOOK_URL || "";
const projectId = process.env.PROJECT_ID || "";
const webhookSecret = process.env.WEBHOOK_SECRET || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { email, password, display_name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Missing email or password" },
        { status: 400 }
      );
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        display_name: display_name || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { detail: "Email already registered" },
          { status: 409 }
        );
      }
      throw error;
    }

    if (webhookUrl && projectId && webhookSecret) {
      try {
        const payload = { project_id: projectId, secret: webhookSecret };
        const signature = crypto
          .createHmac("sha256", webhookSecret)
          .update(JSON.stringify(payload))
          .digest("hex");
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Signature": signature,
          },
          body: JSON.stringify(payload),
        });
      } catch (webhookErr) {
        console.error("Webhook failed:", webhookErr);
      }
    }

    return NextResponse.json(
      { status: "success", email: data.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { detail: "Registration failed" },
      { status: 500 }
    );
  }
}