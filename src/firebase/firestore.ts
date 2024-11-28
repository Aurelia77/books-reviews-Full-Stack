import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  // onAuthStateChanged,
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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import useUserStore from "../hooks/useUserStore";
import {
  AccountFormType,
  BookType,
  MyInfoBookType,
  SearchBooksFormType,
  UserType,
} from "../types";
import { firebaseConfig } from "./firebaseConfig";
//import useUserStore from "./hooks/useUserStore";

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

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

// ??????????? Comprendre !!!!!!!! (si j'enlève ça marche plus)
//Avec useUserStore (Zustand), on met le user à jour à chaque changement d'état de l'utilisateur
onAuthStateChanged(auth, (user) => {
  const setUser = useUserStore.getState().setUser;
  if (user) {
    // User is signed in
    setUser(user);
  } else {
    // User is signed out
    setUser(null);
  }
});

export const signoutFirebase = () => {
  return auth.signOut();
};

export const addBookInfoToMyBooksFirebase = (
  userId: string,
  bookId: string,
  formData: SearchBooksFormType
): Promise<void> => {
  return getDocsByQueryFirebase<UserType>("users", "id", userId)
    .then((users) => {
      const user = users[0];

      if (!user) {
        console.error("User not found");
        return;
      }

      const infoToAdd = {
        bookId,
        bookYear: formData.year ?? null,
        bookNote: formData.note ?? 0,
        bookDescription: formData.description ?? "",
      };

      switch (formData.bookStatus) {
        case "read":
          // if (user.booksRead.includes(bookId)) {
          //   console.error("Book already added to read list!!");
          //   return;
          // }
          //user.booksRead.push(bookId);
          user.booksRead.push(infoToAdd);
          break;
        case "toRead":
          // if (user.booksToRead.includes(bookId)) {
          //   console.error("Book already added to to-read list!!");
          //   return;
          // }
          user.booksToRead.push(infoToAdd);
          break;
        case "inProgress":
          // if (user.booksInProgress.includes(bookId)) {
          //   console.error("Book already added to in-progress list!!");
          //   return;
          // }
          user.booksInProgress.push(infoToAdd);
          break;
        default:
          console.error("Invalid type");
          return;
      }

      return addOrUpdateUserFirebase(userId, user);
    })
    .catch((error) => {
      console.error("Error adding book to myReadBooks: ", error);
      throw error;
    });
};

// Ajouter message : Book déjà ajouté !!
export const addBookFirebase = (
  userId: string,
  book: BookType,
  formData: SearchBooksFormType
) => {
  console.log("ADD BOOK : ", book);

  // On ajoute le livre à la collection books
  return setDoc(doc(db, "books", book.bookId), {
    bookId: book.bookId,
    bookTitle: book.bookTitle ?? "",
    bookAuthor: book.bookAuthor ?? "",
    bookDescription: book.bookDescription ?? "",
    bookCategories: book.bookCategories ?? [],
    bookPageCount: book.bookPageCount ?? 0,
    bookPublishedDate: book.bookPublishedDate ?? "",
    bookPublisher: book.bookPublisher ?? "",
    bookImageLink: book.bookImageLink ?? "",
    bookLanguage: book.bookLanguage ?? "",
    bookIsFromAPI: book.bookIsFromAPI ?? false,
  })
    .then(() =>
      // On ajoute l'id du livre à la liste des livres lus de l'utilisateur
      addBookInfoToMyBooksFirebase(userId, book.bookId, formData)
    )
    .catch((error) => {
      console.error("Error adding book to Firestore: ", error);
      throw error;
    });
};

export const addOrUpdateUserFirebase = (
  userId: string,
  data: UserType | AccountFormType
) => {
  console.log("data", data);
  // on ajoute "{ merge: true }"" pour ne pas remplacer les champs qui ne sont pas modifiés
  return setDoc(doc(db, "users", userId), data, { merge: true }).catch(
    (error) => {
      console.error("Error adding user to Firestore: ", error);
      throw error;
    }
  );
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

export const getMyInfosBookFirebase = (
  userId: string,
  bookId: string
): Promise<MyInfoBookType | null> => {
  return getDocsByQueryFirebase<UserType>("users", "id", userId)
    .then((users) => {
      const user = users[0];
      const book = user.booksRead.find((book) => book.bookId === bookId);
      return book ?? null;
    })
    .catch((error) => {
      console.error("Error getting my infos book: ", error);
      throw error;
    });
};

export const getOtherUsersWhoReadBookFirebase = (
  bookId: string,
  userId: string
): Promise<UserType[]> => {
  const q = query(collection(db, "users"), where("id", "!=", userId));

  return getDocs(q)
    .then((querySnapshot) => {
      const otherUsers: UserType[] = [];
      querySnapshot.forEach((doc) => {
        console.log("DATA", doc.data());
        otherUsers.push(doc.data() as UserType);
      });
      return otherUsers;
    })
    .then((otherUsers) => {
      console.log("USERS", otherUsers);
      return otherUsers.filter((user) =>
        user.booksRead.find((book) => book.bookId === bookId)
      );
    })
    .catch((error) => {
      console.error("Error getting other users who read book: ", error);
      throw error;
    });
};

//   // On récupère tous les utilisateurs qui ont lu le livre
//   return getDocsByQueryFirebase<UserType>("users", "id", userId)
//     .then((users) => {
//       console.log("USERS", users);
//       return users.filter((user) => user.id !== userId);
//     })
//     .then((otherUsers) => {
//       console.log("OTHER USERS", otherUsers);
//       return otherUsers.map((user) => {
//         return user.booksRead.find((book) => book.bookId === bookId);
//       });
//     })
//     .then((books) => {
//       console.log("BOOKS", books);
//       return books;
//     })

//     .catch((error) => {
//       console.error("Error getting other users who read book: ", error);
//       throw error;
//     });

//   // const q = query(
//   //   collection(db, "users"),
//   //   where("booksRead", "array-contains", bookId)
//   // );
//   // return getDocs(q)
//   //   .then((querySnapshot) => {
//   //     const users: UserType[] = [];
//   //     querySnapshot.forEach((doc) => {
//   //       users.push(doc.data() as UserType);
//   //     });
//   //     return users;
//   //   })
//   //   .then((users) => {
//   //     return users.filter((user) => user.id !== userId);
//   //   })
//   //   .catch((error) => {
//   //     console.error("Error getting documents: ", error);
//   //     throw error;
//   //   });
// };

export const bookInMyBooksFirebase = (
  bookId: string,
  userId: string
): Promise<string> => {
  return getDocsByQueryFirebase<UserType>("users", "id", userId)
    .then((users) => {
      const user = users[0];

      let result = "";

      if (user.booksRead.some((book) => book.bookId === bookId))
        result = "read";
      if (user.booksToRead.some((book) => book.bookId === bookId))
        result = "toRead";
      if (user.booksInProgress.some((book) => book.bookId === bookId))
        result = "inProgress";

      return result;
    })
    .catch((error) => {
      console.error("Error checking if book is in myBooks: ", error);
      throw error;
    });
};

// export const uploadImageOnFirebase = (
//   imageUpload: File | ""
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     if (imageUpload) {
//       const uniqueId = `${imageUpload.name}_${Date.now()}`;
//       const imageRef = ref(storage, `usersImg/${uniqueId}`);

//       uploadBytes(imageRef, imageUpload)
//         .then(() => getDownloadURL(imageRef))
//         .then((url) => {
//           resolve(url);
//         })
//         .catch((error) => {
//           console.error("Erreur lors du téléchargement de l'image => ", error);
//           reject(error);
//         });
//     } else {
//       resolve(""); // ou reject(new Error("No image provided")) selon votre logique
//     }
//   });
// };

// export const uploadImageOnFirebase = (imageUpload: File | null) => {
//   console.log("!!IMAGE UPLOAD FIREBASE", imageUpload);

//   if (imageUpload) {
//     const uniqueId = `${imageUpload.name}_${Date.now()}`;
//     const imageRef = ref(storage, `usersImg/${uniqueId}`);

//     return uploadBytes(imageRef, imageUpload)
//       .then(() => getDownloadURL(imageRef))
//       .then((url) => url)
//       .catch((error) => {
//         console.error("Erreur lors du téléchargement de l'image => ", error);
//         throw error;
//       });
//   }
// };

export const uploadImageOnFirebase = async (imageUpload: File | null) => {
  if (imageUpload) {
    // We create a random name for the image so that none of them have the same name
    const imageRef = ref(
      storage,
      `userImages/${imageUpload.name + Date.now()}`
    );
    try {
      await uploadBytes(imageRef, imageUpload);
      // Getting the URL of the uploaded image
      const url = await getDownloadURL(imageRef);

      return url;
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image : ", error);
    }
  } else {
    console.warn("Aucune image fournie pour le téléchargement.");
    return;
  }
};
