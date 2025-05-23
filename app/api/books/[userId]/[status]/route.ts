import { prisma } from "@/lib/prisma";
import { BookStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string; status: string }> }
) {
  const { userId, status } = await context.params;

  console.log("💛💙💚❤️🤍🤎 userId, status", userId, status);

  if (!userId || !status) {
    return NextResponse.json(
      { error: "Missing userId or status" },
      { status: 400 }
    );
  }

  console.log("💛💙💚❤️🤍🤎 userId, status", userId, status);

  try {
    const books = await prisma.userInfoBook.findMany({
      where: {
        userId: userId,
        status: status as BookStatus,
      },
      select: {
        bookId: true,
      },
    });

    return NextResponse.json(books.map((b) => b.bookId));
  } catch (error) {
    console.error("Error fetching userInfoBook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
