import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ experiences: [] });

  const experiences = await prisma.experience.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ experiences });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Convert empty strings to null
  const cleanData = {
    company: body.company?.trim() || body.company,
    role: body.role?.trim() || body.role,
    location: body.location?.trim() || null,
    description: body.description?.trim() || null,
    isCurrent: body.isCurrent ?? false,
  };

  const exp = await prisma.experience.create({
    data: {
      userId: user.id,
      ...cleanData,
    },
  });

  return NextResponse.json({ experience: exp });
}
