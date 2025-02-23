import { UserType } from "./types";

export const APP_NAME = "Book Reviews";

export const EMPTY_USER: UserType = {
  id: "",
  email: "",
  userName: "",
  imgURL: "",
  description: "",
  booksRead: [],
  booksInProgress: [],
  booksToRead: [],
  friends: [],
  isAdmin: false,
};

export const DEFAULT_BOOK_IMAGE =
  "https://placehold.co/150x200?text=Image%0ANon%0ADisponible";
export const DEFAULT_USER_IMAGE = "https://placehold.co/150x150?text=X";

export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

export const BOOK_STATUS = {
  READ: "Lu",
  IN_PROGRESS: "En cours",
  TO_READ: "À lire",
};

export const NO_DESCRIPTION = "Pas de description disponible.";

export const MONTHS = [
  "Mois non précisé",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
