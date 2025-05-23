import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type GetFriendsWhoReadParams = {
  connectedUserId: string | null;
  bookId: string | null;
  excludeUserId?: string | null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const params: GetFriendsWhoReadParams = {
    connectedUserId: searchParams.get("connectedUserId"),
    bookId: searchParams.get("bookId"),
    excludeUserId: searchParams.get("excludeUserId"),
  };

  const { connectedUserId, bookId, excludeUserId } = params;

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
