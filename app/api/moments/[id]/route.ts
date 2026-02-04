import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.moment.findUnique({ where: { id } });

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const moment = await prisma.moment.update({
    where: { id },
    data: {
      title: body.title,
      date: new Date(body.date),
      category: body.category,
      description: body.description,
      imageUrl: body.imageUrl,
      icon: body.icon,
      isRecurring: body.isRecurring,
      isShared: body.isShared,
    },
  });

  return NextResponse.json({ moment });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.moment.findUnique({ where: { id } });

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.moment.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
