"use server";

import { prisma } from "@/lib/prisma";

export const deleteAllBooks = async () => {
  await prisma.book.deleteMany({});

  console.log("All books deleted successfully");
};
