import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 편지 목록 조회 (보낸 편지 + 받은 편지)
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const letters = await prisma.letter.findMany({
    where: {
      OR: [
        { receiverId: user.id },
        { senderId: user.id },
      ],
    },
    include: {
      sender: { select: { nickname: true } },
      receiver: { select: { nickname: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ letters });
}

// 편지 작성
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, themeId, scheduledAt } = await request.json();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { partnerId: true },
  });

  if (!dbUser?.partnerId) {
    return NextResponse.json({ error: "연결된 연인이 없습니다" }, { status: 400 });
  }

  const letter = await prisma.letter.create({
    data: {
      senderId: user.id,
      receiverId: dbUser.partnerId,
      content,
      themeId: themeId || "default",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  });

  return NextResponse.json({ letter }, { status: 201 });
}
