import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 편지 상세 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const letter = await prisma.letter.findFirst({
    where: {
      id,
      OR: [
        { senderId: user.id },
        { receiverId: user.id },
      ],
    },
    include: {
      sender: { select: { nickname: true } },
      receiver: { select: { nickname: true } },
    },
  });

  if (!letter) {
    return NextResponse.json({ error: "편지를 찾을 수 없습니다" }, { status: 404 });
  }

  return NextResponse.json({ letter });
}
