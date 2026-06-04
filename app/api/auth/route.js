import { NextResponse } from "next/server";
import { verifyTelegramData } from "@/lib/telegram";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = createSupabaseAdmin();

async function upsertUserProfile(profile) {
  const { data: existingUser, error: existingError } = await supabase
    .from("users")
    .select("*")
    .eq("id", profile.id)
    .maybeSingle();

  if (existingError) return { error: existingError };

  if (!existingUser) {
    return supabase
      .from("users")
      .insert({
        id: profile.id,
        username: profile.username,
        first_name: profile.first_name,
        balance: profile.balance || 0,
        last_claim: new Date().toISOString(),
      })
      .select()
      .single();
  }

  return supabase
    .from("users")
    .update({
      username: profile.username,
      first_name: profile.first_name,
    })
    .eq("id", profile.id)
    .select()
    .single();
}

async function grantFirstFreeLand(userId) {
  const { data: existingLands, error: existingError } = await supabase
    .from("lands")
    .select("id")
    .eq("owner_id", userId)
    .limit(1);

  if (existingError) return { error: existingError };
  if (existingLands.length > 0) return {};

  const { data: freeLand, error: freeLandError } = await supabase
    .from("lands")
    .select("id")
    .is("owner_id", null)
    .limit(1)
    .single();

  if (freeLandError) return { error: freeLandError };

  const { error: claimError } = await supabase
    .from("lands")
    .update({ owner_id: userId })
    .eq("id", freeLand.id)
    .is("owner_id", null);

  return { error: claimError };
}

export async function POST(req) {
  const { initData } = await req.json();

  if (!initData) {
    const { data, error } = await upsertUserProfile({
      id: 999,
      first_name: "Dev User",
      username: "developer",
      balance: 1000,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    const { error: freeLandError } = await grantFirstFreeLand(data.id);

    if (freeLandError)
      return NextResponse.json({ error: freeLandError.message }, { status: 500 });

    return NextResponse.json(data);
  }

  const isValid = verifyTelegramData(initData, process.env.BOT_TOKEN);

  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urlParams = new URLSearchParams(initData);
  const userRaw = JSON.parse(urlParams.get("user") || "{}");

  const { data, error } = await upsertUserProfile({
    id: userRaw.id,
    username: userRaw.username,
    first_name: userRaw.first_name,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { error: freeLandError } = await grantFirstFreeLand(data.id);

  if (freeLandError)
    return NextResponse.json({ error: freeLandError.message }, { status: 500 });

  return NextResponse.json(data);
}
