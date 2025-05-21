import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const connectedUserId = searchParams.get("connectedUserId");
  const bookId = searchParams.get("bookId");
  const excludeUserId = searchParams.get("excludeUserId");

  if (!connectedUserId || !bookId) {
    return NextResponse.json(
      { error: "Missing userId or bookId" },
      { status: 400 }
    );
  }

  try {
    const connectedUser = await prisma.appUser.findUnique({
      where: { id: connectedUserId },
      select: { friends: true },
    });

    const friendsIds = connectedUser?.friends ?? [];

    console.log("💛💙💚❤️🤍🤎 connectedUser", connectedUser);
    console.log("💛💙💚❤️🤍🤎 friendsIds", friendsIds);

    const friendsWhoRead = await prisma.appUser.findMany({
      where: {
        id: { in: friendsIds, not: excludeUserId || undefined },
        UserInfoBook: {
          some: { bookId: bookId },
          //status: BookStatus.READ,
        },
      },
      select: {
        id: true,
        userName: true,
      },
    });

    return NextResponse.json(friendsWhoRead, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
