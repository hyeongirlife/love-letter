import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 편지 읽음 처리
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.letter.updateMany({
    where: {
      id,
      receiverId: user.id,
      isOpened: false,
    },
    data: {
      isOpened: true,
      openedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
