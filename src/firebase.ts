import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { BookType } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore(app);

// Ajouter message : Book déjà ajouté !!
export async function addBookToReadFirebase(book: BookType) {
  try {
    await setDoc(doc(db, "books", book.bookId), {
      bookId: book.bookId,
      bookTitle: book.bookTitle,
      bookAuthor: book.bookAuthor,
      bookDescription: book.bookDescription,
      bookCategories: book.bookCategories,
      bookPageCount: book.bookPageCount,
      bookPublishedDate: book.bookPublishedDate,
      bookPublisher: book.bookPublisher,
      bookImageLink: book.bookImageLink,
      bookLanguage: book.bookLanguage,
      bookIsFromAPI: book.bookIsFromAPI,
    });
  } catch (error) {
    console.error("Error adding book to Firestore: ", error);
  }
}
// pour fusionner plutôt que remplacer :
// const cityRef = doc(db, 'cities', 'BJ');
// setDoc(cityRef, { capital: true }, { merge: true });

export async function getDocsByQueryFirebase(
  collectionName: string,
  fieldToQuery: string,
  valueToQuery: string | boolean | number
) {
  const q = query(
    collection(db, collectionName),
    where(fieldToQuery, "==", valueToQuery)
  );

  const querySnapshot = await getDocs(q);
  const books: BookType[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    books.push(doc.data() as BookType);
  });

  return books;
}
