"use server";

import { prisma } from "@/lib/prisma";
import { BookType } from "@/lib/types";

export const addBooks = async (books: BookType[]) => {
  await prisma.book.createMany({
    data: books,
    skipDuplicates: true,
  });

  console.log("Books added successfully:", books.length);
};
