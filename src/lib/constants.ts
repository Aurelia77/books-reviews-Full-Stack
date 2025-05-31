import { BookType, UserType } from "./types";

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

export const EMPTY_BOOK: BookType = {
  id: "",
  title: "",
  authors: [],
  description: "",
  categories: [],
  pageCount: 0,
  publishedDate: "",
  publisher: "",
  imageLink: "",
  language: "",
  isFromAPI: true,
  rating: { totalRating: 0, count: 0 },
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

export const LANGUAGES = [
  { name: "Allemand", code: "de" },
  { name: "Anglais", code: "en" },
  //{ name: "Arabe", code: "ar" },
  //{ name: "Coréen", code: "ko" },
  { name: "Espagnol", code: "es" },
  { name: "Français", code: "fr" },
  //{ name: "Grec", code: "el" },
  //{ name: "Hindi", code: "hi" },
  { name: "Italien", code: "it" },
  //{ name: "Japonais", code: "ja" },
  { name: "Néerlandais", code: "nl" },
  { name: "Portugais", code: "pt" },
  //{ name: "Roumain", code: "ro" },
  //{ name: "Russe", code: "ru" },
  //{ name: "Turc", code: "tr" },
];
