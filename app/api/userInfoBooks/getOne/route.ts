import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type UserInfoBookType = {
  userId: string | null;
  bookId: string | null;
};
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const params: UserInfoBookType = {
    userId: searchParams.get("userId"),
    bookId: searchParams.get("bookId"),
  };

  const { userId, bookId } = params;

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
