import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const appUser = await prisma.appUser.findUnique({
      where: {
        id: userId,
      },
    });

    if (!appUser) {
      return NextResponse.json({ error: "AppUser not found" }, { status: 404 });
    }

    return NextResponse.json(appUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching AppUser:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
