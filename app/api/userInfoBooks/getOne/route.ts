import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const bookId = searchParams.get("bookId");

  if (!userId || !bookId) {
    return NextResponse.json(
      { error: "Missing userId or bookId" },
      { status: 400 }
    );
  }

  try {
    const userInfoBook = await prisma.userInfoBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!userInfoBook) {
      return NextResponse.json(
        { error: "UserInfoBook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userInfoBook, { status: 200 });
  } catch (error) {
    console.error("Error fetching UserInfoBook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
