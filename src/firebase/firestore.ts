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
  BookStatusEnum,
  BookType,
  FriendType,
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
  const setUser = useUserStore.getState().setCurrentUser;
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
  currentUserId: string,
  bookId: string,
  formData: SearchBooksFormType
): Promise<void> => {
  return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
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
        case BookStatusEnum.booksRead:
          // if (user.booksRead.includes(bookId)) {
          //   console.error("Book already added to read list!!");
          //   return;
          // }
          //user.booksRead.push(bookId);
          user.booksRead.push(infoToAdd);
          break;
        case BookStatusEnum.booksToRead:
          // if (user.booksToRead.includes(bookId)) {
          //   console.error("Book already added to to-read list!!");
          //   return;
          // }
          user.booksToRead.push(infoToAdd);
          break;
        case BookStatusEnum.booksInProgress:
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

      return addOrUpdateUserFirebase(currentUserId, user);
    })
    .catch((error) => {
      console.error("Error adding book to myReadBooks: ", error);
      throw error;
    });
};

// Ajouter message : Book déjà ajouté !!
export const addBookFirebase = (
  currentUserId: string,
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
      addBookInfoToMyBooksFirebase(currentUserId, book.bookId, formData)
    )
    .catch((error) => {
      console.error("Error adding book to Firestore: ", error);
      throw error;
    });
};

export const addOrUpdateUserFirebase = (
  currentUserId: string,
  data: UserType | AccountFormType
) => {
  console.log("data", data);
  // on ajoute "{ merge: true }" pour ne pas remplacer les champs qui ne sont pas modifiés
  //////// A VOIR CAR DE TOUTE Facon on est obligé de passer tous les champs !!!???
  return setDoc(doc(db, "users", currentUserId), data, { merge: true }).catch(
    (error) => {
      console.error("Error adding user to Firestore: ", error);
      throw error;
    }
  );
};

// Cette fction retourne des BookType[] ou des UserType[] (fonction générique)
export const getDocsByQueryFirebase = <T extends BookType | UserType>(
  collectionName: string,
  fieldToQuery?: string,
  valueToQuery?: string | boolean | number
): Promise<T[]> => {
  const q = query(
    collection(db, collectionName),
    ...(fieldToQuery ? [where(fieldToQuery, "==", valueToQuery)] : [])
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
  currentUserId: string,
  bookId: string
): Promise<MyInfoBookType | null> => {
  return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
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

export const getFriendsWhoReadBookFirebase = (
  bookId: string,
  currentUserId: string,
  userIdNotToCount: string = ""
): Promise<UserType[]> => {
  //console.log("currentUserId", currentUserId);

  const q = query(collection(db, "users"), where("id", "==", currentUserId));

  return getDocs(q)
    .then((querySnapshot) => querySnapshot.docs[0].data() as UserType)
    .then((currentUser: UserType) => currentUser.friends)
    .then((currentUserFriends: FriendType[]) =>
      currentUserFriends.map((friend) => friend.id)
    )
    .then((currentUserFriendsIds: string[]) => {
      //console.log("***CURRENT USER FRIENDS", currentUserFriendsIds);

      if (currentUserFriendsIds.length > 0) {
        const q2 = query(
          collection(db, "users"),
          where("id", "!=", userIdNotToCount),
          where("id", "in", currentUserFriendsIds) // error if currentUserFriendsIds empty
        );

        return getDocs(q2)
          .then((querySnapshot) => {
            const friendsButUserIdNotToCount: UserType[] = [];
            querySnapshot.forEach((doc) => {
              console.log("***DOC", doc.data());
              friendsButUserIdNotToCount.push(doc.data() as UserType);
            });
            return friendsButUserIdNotToCount;
          })
          .then((friendsButUserIdNotToCount) => {
            return friendsButUserIdNotToCount.filter((friend) =>
              friend.booksRead.find((book) => book.bookId === bookId)
            );
          })
          .catch((error) => {
            console.error("Error getting other users who read book: ", error);
            throw error;
          });
      } else {
        // if no friends
        return Promise.resolve([]);
      }
    });

  //const q = query(collection(db, "users"), where("id", "!=", userIdNotToCount));

  // return getDocs(q)
  //   .then((querySnapshot) => {
  //     const otherUsers: UserType[] = [];
  //     querySnapshot.forEach((doc) => {
  //       console.log("DATA", doc.data());
  //       otherUsers.push(doc.data() as UserType);
  //     });
  //     return otherUsers;
  //   })
  //   .then((otherUsers) => {
  //     console.log("USERS", otherUsers);
  //     return otherUsers.filter((user) =>
  //       user.booksRead.find((book) => book.bookId === bookId)
  //     );
  //   })
  //   .catch((error) => {
  //     console.error("Error getting other users who read book: ", error);
  //     throw error;
  //   });
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

export const findBookStatusInUserLibraryFirebase = (
  bookId: string,
  currentUserId: string
): Promise<keyof UserType | ""> => {
  return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
    .then((users) => {
      const user = users[0];
      let result: keyof UserType | "" = "";

      if (user.booksRead.some((book) => book.bookId === bookId))
        result = "booksRead";
      if (user.booksToRead.some((book) => book.bookId === bookId))
        result = "booksToRead";
      if (user.booksInProgress.some((book) => book.bookId === bookId))
        result = "booksInProgress";

      return result;
    })
    .catch((error) => {
      console.error("Error checking if book is in myBooks: ", error);
      throw error;
    });
};

export const isUserMyFriendFirebase = (
  friendId: string,
  currentUserId: string | undefined
): Promise<boolean> => {
  return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
    .then((users) => {
      const user = users[0];

      console.log(
        "friendId",
        friendId,
        "currentUserId",
        currentUserId,
        user.friends.some((user) => user.id === friendId)
      );
      return user.friends.some((user) => user.id === friendId);
    })
    .catch((error) => {
      console.error("Error checking if user is my friend ", error);
      throw error;
    });
};

export const uploadImageOnFirebase = async (imageUpload: File | null) => {
  if (imageUpload) {
    // We create a random name for the image so that none of them have the same name
    const imageRef = ref(
      storage,
      `userProfileImages/${imageUpload.name + Date.now()}`
    );
    try {
      await uploadBytes(imageRef, imageUpload);
      // Getting the URL of the uploaded image
      const url = await getDownloadURL(imageRef);

      return url;
    } catch (error) {
      console.error("Error uploading image on Firebase: ", error);
    }
  } else {
    console.warn("No image provided for upload.");
    return;
  }
};

export const addUserIdToMyFriendsFirebase = (
  currentUserId: string | undefined,
  friendId: string | undefined,
  friendName: string | undefined
): Promise<boolean> => {
  if (currentUserId && friendId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];
        const isAlreadyFriend = user.friends.some(
          (friend) => friend.id === friendId
        );
        if (!isAlreadyFriend) {
          user.friends.push({ id: friendId, userName: friendName ?? "" });
          return addOrUpdateUserFirebase(currentUserId, user).then(() => true);
        } else {
          console.warn("Friend already added");
          return false;
        }
      })
      .catch((error) => {
        console.error("Error adding user to my friends: ", error);
        throw error;
      });
  } else {
    return Promise.resolve(false);
  }
};

export const deleteUserIdToMyFriendsFirebase = (
  currentUserId: string | undefined,
  friendId: string | undefined
): Promise<void> => {
  if (currentUserId && friendId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];
        user.friends = user.friends.filter((friend) => friend.id !== friendId);
        return addOrUpdateUserFirebase(currentUserId, user);
      })
      .catch((error) => {
        console.error("Error deleting user from my friends: ", error);
        throw error;
      });
  } else {
    return Promise.resolve();
  }
};

// export const getDocsByQueryFirebase = <T extends BookType | UserType>(
//   collectionName: string,
//   fieldToQuery?: string,
//   valueToQuery?: string | boolean | number
// ): Promise<T[]> => {
//   const q = query(
//     collection(db, collectionName),
//     ...(fieldToQuery ? [where(fieldToQuery, "==", valueToQuery)] : [])
//   );

//   return getDocs(q)
//     .then((querySnapshot) => {
//       const docs: T[] = [];
//       querySnapshot.forEach((doc) => {
//         docs.push(doc.data() as T);
//       });
//       return docs;
//     })
//     .catch((error) => {
//       console.error("Error getting documents: ", error);
//       throw error;
//     });
// };

export const deleteBookFromMyBooksFirebase = (
  currentUserId: string | undefined,
  bookId: string,
  bookStatus: keyof UserType | ""
): Promise<void> => {
  console.log("bookStatus", bookStatus);

  if (currentUserId && bookStatus !== "") {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users: UserType[]) => users[0])
      .then((user: UserType) => {
        console.log("xxx", user);
        return user;
      })
      .then((user: UserType) => {
        // Destructuring to get the books according to the status
        const {
          [bookStatus as keyof UserType]: booksAccordingToStatus,
          ...rest
        } = user;

        // we need to type the booksAccordingToStatus
        const booksAccordingToStatusTyped =
          booksAccordingToStatus as MyInfoBookType[];

        console.log("rest", rest);
        console.log("booksRead", booksAccordingToStatus);
        const booksReadFiltered = booksAccordingToStatusTyped.filter(
          (book: MyInfoBookType) => book.bookId !== bookId
        );
        console.log("booksReadFiltered", booksReadFiltered);
        return addOrUpdateUserFirebase(currentUserId, {
          [bookStatus]: booksReadFiltered,
          ...rest,
        } as UserType);
      })
      .catch((error) => {
        console.error("Error deleting book from my books: ", error);
        throw error;
      });
  } else {
    return Promise.resolve();
  }
};
