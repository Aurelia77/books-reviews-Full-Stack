import { UserType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const emptyUser: UserType = {
  id: "",
  email: "",
  username: "",
  imgURL: "",
  booksRead: [],
  booksInProgress: [],
  booksToRead: [],
  friends: [],
};
