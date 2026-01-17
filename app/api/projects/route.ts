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

  if (!user) return NextResponse.json({ projects: [] });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
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
    title: body.title?.trim() || body.title,
    link: body.link?.trim() || null,
    githubLink: body.githubLink?.trim() || null,
    description: body.description?.trim() || null,
    techStack: body.techStack?.trim() || null,
  };

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      ...cleanData,
    },
  });

  return NextResponse.json({ project });
}
