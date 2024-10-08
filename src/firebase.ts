import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "./firebase/firebaseConfig";
import { BookType, UserType } from "./types";

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export const registerFirebase = (
  email: string,
  password: string
): Promise<User> => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error during register:", error.message);
      throw error;
    });
};

export const loginFirebase = (
  email: string,
  password: string
): Promise<User> => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error during login:", error.message);
      throw error;
    });
};

// Pour chacune des pages de votre application nécessitant des informations sur l'utilisateur connecté, attachez un observateur à l'objet d'authentification globale. Cet observateur est appelé chaque fois que l’état de connexion de l’utilisateur change.

// Attachez l'observateur à l'aide de la méthode onAuthStateChanged . Lorsqu'un utilisateur se connecte avec succès, vous pouvez obtenir des informations sur l'utilisateur dans l'observateur.
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

export const signoutFirebase = () => {
  return auth.signOut();
};

export const addBookIdToMyReadBooksFirebase = (
  userId: string,
  bookId: string
) => {
  return getDocsByQueryFirebase<UserType>("users", "id", userId)
    .then((users) => {
      const user = users[0];
      if (user.booksRead.includes(bookId)) {
        console.log("Book already added !!");
        return;
      }
      user.booksRead.push(bookId);
      return addOrUpdateUserFirebase(userId, user);
    })
    .catch((error) => {
      console.error("Error adding book to myReadBooks: ", error);
      throw error;
    });
};

// Ajouter message : Book déjà ajouté !!
export const addBookFirebase = (book: BookType) => {
  console.log("ADD BOOK : ", book);

  // On ajoute le livre à la collection books
  return setDoc(doc(db, "books", book.bookId), {
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
  })
    .then(() =>
      // On ajoute l'id du livre à la liste des livres lus de l'utilisateur
      addBookIdToMyReadBooksFirebase(
        "YGZ3EAw9lFdGaCewuQhxyrqcFi42",
        book.bookId
      )
    )
    .catch((error) => {
      console.error("Error adding book to Firestore: ", error);
      throw error;
    });
};
// pour fusionner plutôt que remplacer :
// const cityRef = doc(db, 'cities', 'BJ');
// setDoc(cityRef, { capital: true }, { merge: true });

export const addOrUpdateUserFirebase = (userId: string, data: UserType) => {
  return setDoc(doc(db, "users", userId), data).catch((error) => {
    console.error("Error adding user to Firestore: ", error);
    throw error;
  });
};

// Cette fction retourne des BookType[] ou des UserType[] (fonction générique)
export const getDocsByQueryFirebase = <T extends BookType | UserType>(
  collectionName: string,
  fieldToQuery: string,
  valueToQuery: string | boolean | number
): Promise<T[]> => {
  const q = query(
    collection(db, collectionName),
    where(fieldToQuery, "==", valueToQuery)
  );

  return getDocs(q)
    .then((querySnapshot) => {
      const docs: T[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data() as T);
      });
      return docs;
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
      throw error;
    });
};

export const getUsersWhoReadBookFirebase = (
  bookId: string
): Promise<UserType[]> => {
  const q = query(
    collection(db, "users"),
    where("booksRead", "array-contains", bookId)
  );

  return getDocs(q)
    .then((querySnapshot) => {
      const docs: UserType[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data() as UserType);
      });
      return docs;
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
      throw error;
    });
};
