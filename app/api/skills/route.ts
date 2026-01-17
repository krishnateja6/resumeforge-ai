import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ skills: [] });

  const skills = await prisma.skill.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ skills });
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
    name: body.name?.trim() || body.name,
    level: body.level?.trim() || null,
  };

  // Check for case-insensitive duplicate
  const existingSkills = await prisma.skill.findMany({
    where: { userId: user.id },
    select: { name: true },
  });

  const isDuplicate = existingSkills.some(
    (skill) => skill.name.toLowerCase() === cleanData.name.toLowerCase()
  );

  if (isDuplicate) {
    return NextResponse.json({ error: "Skill already exists" }, { status: 409 });
  }

  try {
    const skill = await prisma.skill.create({
      data: {
        userId: user.id,
        ...cleanData,
      },
    });

    return NextResponse.json({ skill });
  } catch (error) {
    // Handle unique constraint violation (edge case for concurrent requests)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Skill already exists" }, { status: 409 });
    }
    throw error;
  }
}
