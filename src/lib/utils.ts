import { users } from "@/data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const friendsWhoReadBook = (bookId: string): string[] => {
  return users
    .filter((user) => user.booksRead.includes(bookId))
    .map((user) => user.username);
};
