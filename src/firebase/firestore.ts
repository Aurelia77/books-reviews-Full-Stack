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
  MyInfoBookType,
  SearchBooksFormType,
  UserType,
} from "../types";
import { firebaseConfig } from "./firebaseConfig";

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

export const signoutFirebase = (): Promise<void> => {
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

      switch (formData.bookStatus) {
        case BookStatusEnum.booksRead:
          user.booksRead.push({
            id: bookId,
            year: formData.year ?? null,
            note: formData.note ?? 0,
            description: formData.description ?? "",
          });
          break;
        case BookStatusEnum.booksToRead:
          user.booksToRead.push({
            id: bookId,
            description: formData.description ?? "",
          });
          break;
        case BookStatusEnum.booksInProgress:
          user.booksInProgress.push({
            id: bookId,
            description: formData.description ?? "",
          });
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

export const addBookFirebase = (
  currentUserId: string | undefined,
  book: BookType,
  formData: SearchBooksFormType
): Promise<void> => {
  console.log("ADD BOOK : ", book);

  if (currentUserId) {
    const bookInfoToAddToDB: BookType = {
      id: book.id,
      title: book.title ?? "",
      author: book.author ?? "",
      description: book.description ?? "",
      categories: book.categories ?? [],
      pageCount: book.pageCount ?? 0,
      publishedDate: book.publishedDate ?? "",
      publisher: book.publisher ?? "",
      imageLink: book.imageLink ?? "",
      language: book.language ?? "",
      isFromAPI: book.isFromAPI ?? false,
    };
    return setDoc(doc(db, "books", book.id), bookInfoToAddToDB)
      .then(() =>
        addBookInfoToMyBooksFirebase(currentUserId, book.id, formData)
      )
      .catch((error) => {
        console.error("Error adding book to Firestore: ", error);
        throw error;
      });
  } else {
    return Promise.resolve();
  }
};

export const addOrUpdateUserFirebase = (
  currentUserId: string | undefined,
  data: UserType | AccountFormType
): Promise<void> => {
  console.log("data", data);
  // on ajoute "{ merge: true }" pour ne pas remplacer les champs qui ne sont pas modifiés
  //////// A VOIR CAR DE TOUTE Facon on est obligé de passer tous les champs !!!???

  if (currentUserId) {
    return setDoc(doc(db, "users", currentUserId), data, { merge: true }).catch(
      (error) => {
        console.error("Error adding user to Firestore: ", error);
        throw error;
      }
    );
  } else {
    return Promise.resolve();
  }
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

  console.log("FIREBASE collectionName", collectionName);
  console.log("FIREBASE fieldToQuery", fieldToQuery);
  console.log("FIREBASE valueToQuery", valueToQuery);
  console.log("FIREBASE q", q);

  return getDocs(q)
    .then((querySnapshot) => {
      const docs: T[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data() as T);
      });
      console.log("DOCS", docs);
      return docs;
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
      throw error;
    });
};

export const getMyInfosBookFirebase = (
  currentUserId: string | undefined,
  bookId: string
): Promise<MyInfoBookType | null> => {
  if (currentUserId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];
        const book = user.booksRead.find((book) => book.id === bookId);
        return book ?? null;
      })
      .catch((error) => {
        console.error("Error getting my infos book: ", error);
        throw error;
      });
  } else {
    return Promise.resolve(null);
  }
};

export const getFriendsWhoReadBookFirebase = (
  bookId: string,
  currentUserId: string | undefined,
  userIdNotToCount: string = ""
): Promise<UserType[]> => {
  //console.log("currentUserId", currentUserId);

  if (currentUserId && bookId) {
    const q = query(collection(db, "users"), where("id", "==", currentUserId));

    return getDocs(q)
      .then((querySnapshot) => querySnapshot.docs[0].data() as UserType)
      .then((currentUser: UserType) => currentUser.friends)
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
                friendsButUserIdNotToCount.push(doc.data() as UserType);
              });
              return friendsButUserIdNotToCount;
            })
            .then((friendsButUserIdNotToCount) => {
              return friendsButUserIdNotToCount.filter((friend) =>
                friend.booksRead.find((book) => book.id === bookId)
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
  } else {
    return Promise.resolve([]);
  }
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
  bookId: string | undefined,
  currentUserId: string | undefined
): Promise<keyof UserType | ""> => {
  if (bookId && currentUserId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];
        let result: keyof UserType | "" = "";

        if (user.booksRead.some((book) => book.id === bookId))
          result = "booksRead";
        if (user.booksToRead.some((book) => book.id === bookId))
          result = "booksToRead";
        if (user.booksInProgress.some((book) => book.id === bookId))
          result = "booksInProgress";

        return result;
      })
      .catch((error) => {
        console.error("Error checking if book is in myBooks: ", error);
        throw error;
      });
  } else {
    return Promise.resolve("");
  }
};

export const isUserMyFriendFirebase = (
  friendId: string,
  currentUserId: string | undefined
): Promise<boolean> => {
  if (currentUserId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];

        console.log(
          "friendId",
          friendId,
          "currentUserId",
          currentUserId,
          user.friends.some((myfriendId) => myfriendId === friendId)
        );
        return user.friends.some((myfriendId) => myfriendId === friendId);
      })
      .catch((error) => {
        console.error("Error checking if user is my friend ", error);
        throw error;
      });
  } else {
    return Promise.resolve(false);
  }
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
  friendId: string | undefined
): Promise<boolean> => {
  if (currentUserId && friendId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];
        const isAlreadyFriend = user.friends.some(
          (myFriendId) => myFriendId === friendId
        );
        if (!isAlreadyFriend) {
          user.friends.push(friendId);
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
        user.friends = user.friends.filter(
          (myfriendId) => myfriendId !== friendId
        );
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
          (book: MyInfoBookType) => book.id !== bookId
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
