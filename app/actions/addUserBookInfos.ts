"use server";

import { BookStatusValues } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { UserInfoBookWithoutUserIdAndId } from "@/lib/types";

export const addUserBookInfos = async (
  userId: string,
  userBookInfos: UserInfoBookWithoutUserIdAndId[]
) => {
  const formattedUserBookInfos = userBookInfos.map((bookInfos) => ({
    userId,
    bookId: bookInfos.bookId,
    year: bookInfos.status === BookStatusValues.READ ? bookInfos.year : 0,
    month: bookInfos.status === BookStatusValues.READ ? bookInfos.month : 0,
    note: bookInfos.status === BookStatusValues.READ ? bookInfos.note : 0,
    comments: bookInfos.comments,
    status: bookInfos.status,
  }));

  await prisma.userInfoBook.createMany({
    data: formattedUserBookInfos,
    skipDuplicates: true,
  });

  console.log(
    "formattedUserBookInfos added successfully:",
    userBookInfos.length
  );
};
