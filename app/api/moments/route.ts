import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { partnerId: true },
    });

    const whereConditions = [{ userId: user.id }];
    if (dbUser?.partnerId) {
      whereConditions.push({ userId: dbUser.partnerId, isShared: true } as typeof whereConditions[0]);
    }

    const moments = await prisma.moment.findMany({
      where: { OR: whereConditions },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ moments });
  } catch (error) {
    console.error("GET /api/moments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const moment = await prisma.moment.create({
      data: {
        title: body.title,
        date: new Date(body.date),
        category: body.category || "milestone",
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        icon: body.icon || "favorite",
        isRecurring: Boolean(body.isRecurring),
        isShared: Boolean(body.isShared),
        userId: user.id,
      },
    });

    return NextResponse.json({ moment });
  } catch (error) {
    console.error("POST /api/moments error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
