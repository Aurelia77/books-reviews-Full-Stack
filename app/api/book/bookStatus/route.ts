import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, bookId } = body;
  console.log("💛💙 userId, bookId", userId, bookId);

  if (!userId || !bookId) {
    return new Response(JSON.stringify({ error: "Missing userId or bookId" }), {
      status: 400,
    });
  }

  try {
    const userBook = await prisma.userInfoBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    const status = userBook ? userBook.status : null;

    return new Response(JSON.stringify({ status }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
