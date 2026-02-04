import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { 
      partnerId: true,
      connectedAt: true,
      partner: { select: { nickname: true } }
    },
  });

  return NextResponse.json({ 
    partnerId: dbUser?.partnerId ?? null,
    partnerNickname: dbUser?.partner?.nickname ?? null,
    connectedAt: dbUser?.connectedAt ?? null
  });
}
