"use server";

import { prisma } from "@/lib/prisma";

export const deleteAllUserBookInfos = async () => {
  await prisma.userInfoBook.deleteMany({});

  console.log("All userBookInfos deleted successfully");
};
