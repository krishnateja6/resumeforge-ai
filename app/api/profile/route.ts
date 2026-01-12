import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  return NextResponse.json({ profile: user?.profile ?? null });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      fullName: data.fullName ?? null,
      headline: data.headline ?? null,
      location: data.location ?? null,
      summary: data.summary ?? null,
      website: data.website ?? null,
      github: data.github ?? null,
      linkedin: data.linkedin ?? null,
    },
    create: {
      userId: user.id,
      fullName: data.fullName ?? null,
      headline: data.headline ?? null,
      location: data.location ?? null,
      summary: data.summary ?? null,
      website: data.website ?? null,
      github: data.github ?? null,
      linkedin: data.linkedin ?? null,
    },
  });

  return NextResponse.json({ profile });
}
