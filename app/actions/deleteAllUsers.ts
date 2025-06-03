"use server";

import { prisma } from "@/lib/prisma";

export const deleteAllUsers = async () => {
  await prisma.appUser.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verification.deleteMany({});

  console.log("All users deleted successfully");
};
