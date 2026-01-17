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

  if (!user) return NextResponse.json({ educations: [] });

  const educations = await prisma.education.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ educations });
}

export async function POST(req: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/e86f3351-5db4-4051-ba5e-9159be634730',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/education/route.ts:24',message:'POST education entry',data:{method:req.method},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/e86f3351-5db4-4051-ba5e-9159be634730',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/education/route.ts:35',message:'POST education body',data:{school:body.school,schoolTrimmed:body.school?.trim(),emptyStrings:Object.entries(body).filter(([k,v])=>v==='').map(([k])=>k)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Convert empty strings to null
  const cleanData = {
    school: body.school?.trim() || body.school,
    degree: body.degree?.trim() || null,
    field: body.field?.trim() || null,
    grade: body.grade?.trim() || null,
    description: body.description?.trim() || null,
  };

  const education = await prisma.education.create({
    data: {
      userId: user.id,
      ...cleanData,
    },
  });

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/e86f3351-5db4-4051-ba5e-9159be634730',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/education/route.ts:53',message:'Education created',data:{educationId:education.id,school:education.school},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  return NextResponse.json({ education });
}
