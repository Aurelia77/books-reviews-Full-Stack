import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import useUserStore from "../hooks/useUserStore";
import {
  AccountFormType,
  BookRatingType,
  BookStatusEnum,
  BookType,
  MyInfoBookFormType,
  UserBookInfoType,
  UserInfoBookType,
  UserType,
} from "../lib/types";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);

// --- Auth functions (register, login, logout, password reset) ---
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

export const signoutFirebase = (): Promise<void> => {
  return auth.signOut();
};

export const sendPasswordResetEmailFirebase = (
  email: string
): Promise<void> => {
  return sendPasswordResetEmail(auth, email)
    .then(() => {})
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error (${errorCode}): ${errorMessage}`);
    });
};

// --- Global auth state listener (onAuthStateChanged) ---
onAuthStateChanged(auth, (user) => {
  const setUser = useUserStore.getState().setCurrentUser;
  const setProfileImage = useUserStore.getState().setProfileImage;

  if (user) {
    setUser(user);

    getDocsByQueryFirebase<UserType>("users", "id", user.uid).then((users) => {
      setProfileImage(users[0].imgURL);
    });
  } else {
    setUser(null);
    setProfileImage("");
  }
});

// --- Book CRUD and rating utilities ---
export const updateBookAverageRatingFirebase = (
  action: "add" | "remove",
  bookId: string,
  userNote: number | undefined,
  previousNote?: number | null
): void => {
  getDocsByQueryFirebase<BookType>("books", "id", bookId).then((books) => {
    const newRating: BookRatingType = books[0].rating;
    if (action === "add") {
      if (userNote !== undefined) {
        if (previousNote) {
          newRating.totalRating += userNote - previousNote;
        } else {
          newRating.count += 1;
          newRating.totalRating += userNote;
        }
      }
      if (userNote === 0) newRating.count -= 1;
    } else if (action === "remove") {
      if (userNote) {
        newRating.count -= 1;
        newRating.totalRating -= userNote;
      }
    }

    setDoc(
      doc(db, "books", bookId),
      {
        rating: newRating,
      },
      { merge: true }
    );
  });
};

export const addOrUpdateBookInfoToMyBooksFirebase = (
  userId: string | undefined,
  bookId: string,
  formData: MyInfoBookFormType,
  previousNote?: number | null
): Promise<void> => {
  return getDocsByQueryFirebase<UserType>("users", "id", userId)
    .then((users) => {
      const user = users[0];

      if (!user) {
        console.error("User not found");
        return;
      }

      user.booksRead = user.booksRead.filter((book) => book.id !== bookId);
      user.booksInProgress = user.booksInProgress.filter(
        (book) => book.id !== bookId
      );
      user.booksToRead = user.booksToRead.filter((book) => book.id !== bookId);

      // We remove the book from the old list if it was already in one and add the book to the right list according to the status
      switch (formData.bookStatus) {
        case BookStatusEnum.booksReadList:
          {
            user.booksInProgress = user.booksInProgress.filter(
              (book) => book.id !== bookId
            );
            user.booksToRead = user.booksToRead.filter(
              (book) => book.id !== bookId
            );
            const bookIndex = user.booksRead.findIndex(
              (book) => book.id === bookId
            );

            if (bookIndex !== -1) {
              user.booksRead[bookIndex] = { id: bookId, ...formData };
            } else {
              user.booksRead.push({
                id: bookId,
                year: formData.year ?? null,
                month: formData.month ?? null,
                userNote: formData.userNote ?? 0,
                userComments: formData.userComments,
              });
            }
          }
          break;
        case BookStatusEnum.booksInProgressList:
          {
            user.booksRead = user.booksRead.filter(
              (book) => book.id !== bookId
            );
            user.booksToRead = user.booksToRead.filter(
              (book) => book.id !== bookId
            );
            const bookIndex = user.booksInProgress.findIndex(
              (book) => book.id === bookId
            );

            if (bookIndex !== -1) {
              user.booksInProgress[bookIndex] = { id: bookId, ...formData };
            } else {
              user.booksInProgress.push({
                id: bookId,
                userComments: formData.userComments,
              });
            }
          }
          break;
        case BookStatusEnum.booksToReadList:
          {
            user.booksRead = user.booksRead.filter(
              (book) => book.id !== bookId
            );
            user.booksInProgress = user.booksInProgress.filter(
              (book) => book.id !== bookId
            );
            const bookIndex = user.booksToRead.findIndex(
              (book) => book.id === bookId
            );

            if (bookIndex !== -1) {
              user.booksToRead[bookIndex] = { id: bookId, ...formData };
            } else {
              user.booksToRead.push({
                id: bookId,
                userComments: formData.userComments,
              });
            }
          }
          break;
        default:
          console.error("Invalid type");
          return;
      }

      return addOrUpdateUserFirebase(userId, user);
    })
    .then(() => {
      updateBookAverageRatingFirebase(
        "add",
        bookId,
        formData.bookStatus === BookStatusEnum.booksReadList
          ? formData.userNote
          : 0,
        previousNote
      );
    })
    .catch((error) => {
      console.error("Error adding book to myReadBooks: ", error);
      throw error;
    });
};

export const addBookFirebase = (
  userId: string | undefined,
  book: BookType,
  formData: MyInfoBookFormType
): Promise<void> => {
  return (
    // First, we check if the book is already in the database
    getDocsByQueryFirebase<BookType>("books", "id", book.id)
      .then((books) => {
        if (books.length === 0) {
          const bookInfoToAddToDB: BookType = {
            id: book.id,
            title: book.title ?? "",
            authors: book.authors ?? [],
            description: book.description ?? "",
            categories: book.categories ?? [],
            pageCount: book.pageCount ?? 0,
            publishedDate: book.publishedDate ?? "",
            publisher: book.publisher ?? "",
            imageLink: book.imageLink ?? "",
            language: book.language ?? "",
            isFromAPI: book.isFromAPI ?? false,
            rating: { totalRating: 0, count: 0 },
          };
          return setDoc(doc(db, "books", book.id), bookInfoToAddToDB);
        }
      })
      // then we add the information provided by the user
      .then(() =>
        addOrUpdateBookInfoToMyBooksFirebase(userId, book.id, formData)
      )
      .catch((error) => {
        console.error("Error adding book: ", error);
        throw error;
      })
  );
};

// --- User CRUD functions ---
export const addOrUpdateUserFirebase = (
  currentUserId: string | undefined,
  data: UserType | AccountFormType
): Promise<void> => {
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

// --- Query helpers ---
export const getDocsByQueryFirebase = <T extends BookType | UserType>(
  collectionName: string,
  fieldToQuery?: string,
  valueToQuery?: string | boolean | number
): Promise<T[]> => {
  const q = query(
    collection(db, collectionName),
    ...(fieldToQuery && valueToQuery
      ? [where(fieldToQuery, "==", valueToQuery)]
      : [])
  );

  const currentUser = useUserStore.getState().currentUser;

  if (currentUser) {
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
  } else {
    return Promise.resolve([]);
  }
};

// --- GET helpers ---
export const getUsersWhoReadBookCommentsAndNotesFirebase = (
  bookId: string
): Promise<UserBookInfoType[]> => {
  const q = query(collection(db, "users"));

  return getDocs(q)
    .then((querySnapshot) => {
      const users: UserType[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserType);
      });
      return users;
    })
    .then((users) => {
      const usersWhoReadBook = users.filter((user) =>
        user.booksRead.some((book) => book.id === bookId)
      );

      return usersWhoReadBook
        .map((user) => {
          const book = user.booksRead.find((book) => book.id === bookId);
          return {
            userName: user.userName,
            imgURL: user.imgURL,
            userId: user.id,
            userComments: book?.userComments ?? "",
            userNote: book?.userNote ?? 0,
          } as UserBookInfoType;
        })
        .filter(
          (userBookInfo) =>
            userBookInfo.userComments !== "" || userBookInfo.userNote !== 0
        );
    })
    .then((usersComments) => {
      return usersComments;
    })
    .catch((error) => {
      console.error("Error getting comments of users who read book: ", error);
      throw error;
    });
};

export const getUserInfosBookFirebase = (
  userId: string | undefined,
  bookId: string,
  bookStatus: BookStatusEnum
): Promise<UserInfoBookType | null> => {
  if (userId) {
    return getDocsByQueryFirebase<UserType>("users", "id", userId)
      .then((users) => {
        const user = users[0];
        const book = user[bookStatus].find((book) => book.id === bookId);

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

export const getUsersWhoReadBookFirebase = (
  bookId: string,
  currentUserId: string | undefined,
  userViewId: string = ""
): Promise<UserType[]> => {
  if (currentUserId && bookId) {
    const q = query(collection(db, "users"), where("id", "==", currentUserId));

    return getDocs(q)
      .then((querySnapshot) => querySnapshot.docs[0].data() as UserType)
      .then((currentUser: UserType) => currentUser.friends)
      .then((currentUserFriendsIds: string[]) => {
        if (currentUserFriendsIds.length > 0) {
          const q2 = query(
            collection(db, "users"),
            where("id", "!=", userViewId),
            where("id", "in", currentUserFriendsIds) // error if currentUserFriendsIds empty
          );

          return getDocs(q2)
            .then((querySnapshot) => {
              const friendsButuserViewId: UserType[] = [];
              querySnapshot.forEach((doc) => {
                friendsButuserViewId.push(doc.data() as UserType);
              });
              return friendsButuserViewId;
            })
            .then((friendsButuserViewId) => {
              return friendsButuserViewId.filter((friend) =>
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

export const getUsersReadBooksIdsFirebase = (
  currentUserId: string,
  onlyFriends: boolean = false
): Promise<string[]> => {
  const queryCondition = onlyFriends
    ? ["users", "id", currentUserId]
    : ["users"];

  return (
    getDocsByQueryFirebase<UserType>(
      queryCondition[0],
      queryCondition[1],
      queryCondition[2]
    )
      // we search for the friends of the logged-in user
      // OR all users
      .then((users) => {
        const user = users[0];
        if (onlyFriends) {
          return user.friends;
        } else {
          return users;
        }
      })
      // We return the ids of their friends
      // OR all users
      .then((usersIdsOrAllUsers) => {
        let promises;
        if (onlyFriends) {
          promises = usersIdsOrAllUsers.map((friendId) =>
            getDocsByQueryFirebase<UserType>(
              "users",
              "id",
              friendId as string
            ).then((friend) => friend[0])
          );
          return Promise.all(promises);
        } else {
          return usersIdsOrAllUsers as UserType[]; // here allUsers because onlyFriends = false
        }
      })
      .then((users) => {
        return users.map((user) => {
          return user.booksRead;
        });
      })
      // we retrieve the info of their read books
      .then((usersBooksReadInfo) => {
        return usersBooksReadInfo.map((userBooksReadInfo) => {
          return userBooksReadInfo.map((book) => {
            return book.id;
          });
        });
      })
      .then((friendsBooksReadIds) => {
        return friendsBooksReadIds.flat();
      })
      .then((flattenedBooksReadIds) => {
        return [...new Set(flattenedBooksReadIds)];
      })
      .catch((error) => {
        console.error("Error getting friends read books: ", error);
        throw error;
      })
  );
};

export const findBookCatInUserLibraryFirebase = (
  bookId: string | undefined,
  currentUserId: string | undefined
): Promise<BookStatusEnum | ""> => {
  if (bookId && currentUserId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];
        let result: BookStatusEnum | "" = "";

        switch (true) {
          case user.booksRead.some((book) => book.id === bookId):
            result = BookStatusEnum.booksReadList;
            break;
          case user.booksToRead.some((book) => book.id === bookId):
            result = BookStatusEnum.booksToReadList;
            break;
          case user.booksInProgress.some((book) => book.id === bookId):
            result = BookStatusEnum.booksInProgressList;
            break;
          default:
            result = "";
        }

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

// --- Image upload utility ---
export const uploadImageOnFirebase = (
  image: File,
  storage: FirebaseStorage,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `userProfileImages/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress(progress); // Call the callback function to update the progress
      },
      (error) => {
        console.error("Erreur lors du téléchargement de l'image => ", error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          resolve(url);
        });
      }
    );
  });
};

// --- Data deletion utilities ---

export const deleteAllDatas = (): void => {
  const usersCollection = collection(db, "users");
  const booksCollection = collection(db, "books");

  const deleteUsers = getDocs(usersCollection).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  });

  const deleteBooks = getDocs(booksCollection).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  });

  Promise.all([deleteUsers, deleteBooks]);
};

export const deleteBookFromMyBooksFirebase = (
  currentUserId: string | undefined,
  bookId: string,
  bookStatus: keyof UserType | ""
): Promise<void> => {
  let noteToRemove: number;

  if (currentUserId && bookStatus !== "") {
    return (
      getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
        .then((users: UserType[]) => users[0])
        .then((user: UserType) => {
          return user;
        })
        .then((user: UserType) => {
          const {
            [bookStatus as keyof UserType]: booksAccordingToStatus,
            ...rest
          } = user;

          const booksAccordingToStatusTyped =
            booksAccordingToStatus as UserInfoBookType[];

          const bookIndex = booksAccordingToStatusTyped.findIndex(
            (book) => book.id === bookId
          );
          noteToRemove = booksAccordingToStatusTyped[bookIndex].userNote ?? 0;
          const booksReadFiltered = booksAccordingToStatusTyped.filter(
            (book: UserInfoBookType) => book.id !== bookId
          );
          return addOrUpdateUserFirebase(currentUserId, {
            [bookStatus]: booksReadFiltered,
            ...rest,
          } as UserType);
        })
        // remove the note from the book average rating
        .then(() => {
          updateBookAverageRatingFirebase("remove", bookId, noteToRemove);
        })
        .catch((error) => {
          console.error("Error deleting book from my books: ", error);
          throw error;
        })
    );
  } else {
    return Promise.resolve();
  }
};
