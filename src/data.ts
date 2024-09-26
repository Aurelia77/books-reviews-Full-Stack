import { BookType, UserType } from "./types";

export const books: BookType[] = [
  {
    id: "1",
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    description: "Un conte poétique et philosophique.",
    categories: ["Fiction"],
    pageCount: 96,
    publishedDate: "1943-04-06",
    publisher: "Reynal & Hitchcock",
    imageLink: "https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG",
    language: "fr"
  },
   {
    id: "2",
    title: "1984",
    author: "George Orwell",
    description: "Un roman dystopique.",
    categories: ["Dystopian"],
    pageCount: 328,
    publishedDate: "1949-06-08",
    publisher: "Secker & Warburg",
    imageLink: "https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg",
    language: "en"
  },
  {
    id: "3",
    title: "Moby Dick",
    author: "Herman Melville",
    description: "Une aventure épique en mer.",
    categories: ["Adventure"],
    pageCount: 635,
    publishedDate: "1851-10-18",
    publisher: "Harper & Brothers",
    imageLink: "https://upload.wikimedia.org/wikipedia/commons/4/41/Moby-Dick_FE_title_page.jpg",
    language: "en"
  },
  // {
  //   id: "4",
  //   title: "Pride and Prejudice",
  //   author: "Jane Austen",
  //   description: "Un roman d'amour classique.",
  //   categories: ["Romance"],
  //   pageCount: 279,
  //   publishedDate: "1813-01-28",
  //   publisher: "T. Egerton",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Title_page_of_Pride_and_Prejudice%2C_the_first_edition.jpg",
  //   language: "en"
  // },
  // {
  //   id: "5",
  //   title: "To Kill a Mockingbird",
  //   author: "Harper Lee",
  //   description: "Un roman sur l'injustice raciale.",
  //   categories: ["Fiction"],
  //   pageCount: 281,
  //   publishedDate: "1960-07-11",
  //   publisher: "J.B. Lippincott & Co.",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/en/7/79/To_Kill_a_Mockingbird.JPG",
  //   language: "en"
  // },
  // {
  //   id: "6",
  //   title: "The Great Gatsby",
  //   author: "F. Scott Fitzgerald",
  //   description: "Un roman sur le rêve américain.",
  //   categories: ["Fiction"],
  //   pageCount: 180,
  //   publishedDate: "1925-04-10",
  //   publisher: "Charles Scribner's Sons",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/en/f/f7/TheGreatGatsby_1925jacket.jpeg",
  //   language: "en"
  // },
  // {
  //   id: "7",
  //   title: "War and Peace",
  //   author: "Leo Tolstoy",
  //   description: "Un roman historique épique.",
  //   categories: ["Historical"],
  //   pageCount: 1225,
  //   publishedDate: "1869-01-01",
  //   publisher: "The Russian Messenger",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/commons/1/1b/War-and-peace-book-cover.jpg",
  //   language: "ru"
  // },
  // {
  //   id: "8",
  //   title: "The Catcher in the Rye",
  //   author: "J.D. Salinger",
  //   description: "Un roman sur l'adolescence.",
  //   categories: ["Fiction"],
  //   pageCount: 214,
  //   publishedDate: "1951-07-16",
  //   publisher: "Little, Brown and Company",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/en/3/32/Rye_catcher.jpg",
  //   language: "en"
  // },
  // {
  //   id: "9",
  //   title: "The Hobbit",
  //   author: "J.R.R. Tolkien",
  //   description: "Une aventure fantastique.",
  //   categories: ["Fantasy"],
  //   pageCount: 310,
  //   publishedDate: "1937-09-21",
  //   publisher: "George Allen & Unwin",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg",
  //   language: "en"
  // },
  // {
  //   id: "10",
  //   title: "Crime and Punishment",
  //   author: "Fyodor Dostoevsky",
  //   description: "Un roman philosophique.",
  //   categories: ["Philosophical"],
  //   pageCount: 671,
  //   publishedDate: "1866-01-01",
  //   publisher: "The Russian Messenger",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Crimeandpunishmentcover.png",
  //   language: "ru"
  // },
  // {
  //   id: "11",
  //   title: "Aliéno d'Aquitaine, l'été d'un reine",
  //   author: "Auteur Inconnu",
  //   description: "Un roman historique sur Aliéno d'Aquitaine.",
  //   categories: ["Historical", "Fiction"],
  //   pageCount: 350,
  //   publishedDate: "2023-01-01",
  //   publisher: "Éditions Historiques",
  //   imageLink: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Eleanor_of_Aquitaine.jpg",
  //   language: "fr"
  // }
];


export const users: UserType[] = [
  {
    "id": "1",
    "email": "user1@example.com",
    "username": "Titi",
    "password": "password1",
    "booksRead": ["1", "2", "3"],
    "booksInProgress": ["4"],
    "booksToRead": ["5", "6"]
  },
  {
    "id": "2",
    "email": "user2@example.com",
    "username": "Loulou",
    "password": "password2",
    "booksRead": ["1", "4"],
    "booksInProgress": ["2"],
    "booksToRead": ["3", "7"]
  },
  {
    "id": "3",
    "email": "user3@example.com",
    "username": "Lolo",
    "password": "password3",
    "booksRead": ["5", "6", "7", "8"],
    "booksInProgress": ["9"],
    "booksToRead": ["10"]
  },
  {
    "id": "4",
    "email": "user4@example.com",
    "username": "Coco",
    "password": "password4",
    "booksRead": [],
    "booksInProgress": ["1", "2"],
    "booksToRead": ["3", "4", "5"]
  },
  {
    "id": "5",
    "email": "user5@example.com",
    "username": "Bubu",
    "password": "password5",
    "booksRead": ["9", "10"],
    "booksInProgress": ["6"],
    "booksToRead": ["7", "8"]
  }
] 