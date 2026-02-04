import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inviteCode } = await request.json();

  // 초대 코드로 상대방 찾기
  const partner = await prisma.user.findUnique({
    where: { inviteCode },
  });

  if (!partner) {
    return NextResponse.json({ error: "유효하지 않은 초대 코드입니다" }, { status: 404 });
  }

  if (partner.id === user.id) {
    return NextResponse.json({ error: "자신의 코드는 사용할 수 없습니다" }, { status: 400 });
  }

  if (partner.partnerId) {
    return NextResponse.json({ error: "이미 연결된 사용자입니다" }, { status: 400 });
  }

  // 양쪽 모두 연결
  const now = new Date();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { partnerId: partner.id, connectedAt: now },
    }),
    prisma.user.update({
      where: { id: partner.id },
      data: { partnerId: user.id, connectedAt: now },
    }),
  ]);

  return NextResponse.json({ success: true, partner: { nickname: partner.nickname } });
}
