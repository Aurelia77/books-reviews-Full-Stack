import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  // onAuthStateChanged,
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
} from "../types";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);

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

onAuthStateChanged(auth, (user) => {
  const setUser = useUserStore.getState().setCurrentUser;
  const setProfileImage = useUserStore.getState().setProfileImage;

  // update context
  if (user) {
    // User is signed in
    setUser(user);

    // To update the profile image in the navbar
    getDocsByQueryFirebase<UserType>("users", "id", user.uid).then((users) => {
      setProfileImage(users[0].imgURL);
    });
  } else {
    // User is signed out
    setUser(null);
    setProfileImage("");
  }
});

export const signoutFirebase = (): Promise<void> => {
  return auth.signOut();
};

export const sendPasswordResetEmailFirebase = (
  email: string
): Promise<void> => {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      //console.log("Password reset email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error (${errorCode}): ${errorMessage}`);
    });
};

export const updateBookAverageRatingFirebase = (
  action: "add" | "remove",
  bookId: string,
  userNote: number | undefined,
  previousNote?: number | null
): void => {
  console.log("999userNote", userNote);
  console.log("previousNote", previousNote);

  getDocsByQueryFirebase<BookType>("books", "id", bookId).then((books) => {
    console.log("/*/*bookAverageRating", books[0].rating);

    const newRating: BookRatingType = books[0].rating;

    // pas besoin if newratting car tjs rempli maintenant !!!
    // pas besoin if newratting car tjs rempli maintenant !!!
    // pas besoin if newratting car tjs rempli maintenant !!!
    // pas besoin if newratting car tjs rempli maintenant !!!
    if (action === "add") {
      if (userNote !== undefined) {
        console.log("999 1");
        if (previousNote) {
          console.log("999 2");
          newRating.totalRating += userNote - previousNote;
        } else {
          console.log("999 3");
          newRating.count += 1;
          newRating.totalRating += userNote;
        }
      }
      // si plus de notation on enlève 1 au count
      if (userNote === 0) newRating.count -= 1;
    } else if (action === "remove") {
      if (userNote) {
        console.log("qqq 4");
        newRating.count -= 1;
        newRating.totalRating -= userNote;
      }
    }

    console.log("999 newRating", newRating);

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
  console.log("** ADD INFO USER");
  console.log("**userId", userId);
  console.log("**bookId", bookId);
  console.log("**formData", formData);
  console.log("**previousNote", previousNote);

  return getDocsByQueryFirebase<UserType>("users", "id", userId)
    .then((users) => {
      const user = users[0];

      console.log("999formdata", formData);

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

      //console.log("99user", user);

      return addOrUpdateUserFirebase(userId, user);
    })
    .then(() => {
      updateBookAverageRatingFirebase(
        "add",
        bookId,
        formData.userNote,
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
  console.log("**ADD BOOK : ", book);

  console.log("currentUserId", userId);
  console.log("book", book);
  console.log("formData", formData);

  //on vérifie d'abord si le livre est déjà dans la base de données
  return (
    getDocsByQueryFirebase<BookType>("books", "id", book.id)
      .then((books) => {
        console.log("books", books);

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
      // puis on ajoute les infos données par l'utilisateur
      .then(() =>
        addOrUpdateBookInfoToMyBooksFirebase(userId, book.id, formData)
      )
      .catch((error) => {
        console.error("Error adding book: ", error);
        throw error;
      })
  );
};

export const addOrUpdateUserFirebase = (
  currentUserId: string | undefined,
  data: UserType | AccountFormType
): Promise<void> => {
  ////console.log("data", data);
  // on ajoute "{ merge: true }" pour ne pas remplacer les champs qui ne sont pas modifiés (par ex l'id)

  // function isUserType(data): data is UserType {
  //   return (data as UserType).booksRead !== undefined;
  // }

  // if (isUserType(data)) {
  //   //console.log("9999userBOOKSREAD", data.booksRead);
  // }

  // //console.log("9999user", data);

  if (currentUserId) {
    return (
      setDoc(doc(db, "users", currentUserId), data, { merge: true })
        // .then A SUPP =>  juste pour voir
        .then(() => {
          console.log("!!!!! user mis à jour !!! addOrUpdateUserFirebase");
        })
        .catch((error) => {
          console.error("Error adding user to Firestore: ", error);
          throw error;
        })
    );
  } else {
    return Promise.resolve();
  }
};

export const getUsersWhoReadBookCommentsAndNotesFirebase = (
  bookId: string
): Promise<UserBookInfoType[]> => {
  const q = query(collection(db, "users")); // Récupère tous les utilisateurs

  return getDocs(q)
    .then((querySnapshot) => {
      const users: UserType[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserType);
      });
      return users;
    })
    .then((users) => {
      console.log("usersComments users", users);

      // Filtre les utilisateurs qui ont lu le livre avec l'ID donné
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
      console.log("usersComments", usersComments);
      return usersComments;
    })
    .catch((error) => {
      console.error("Error getting comments of users who read book: ", error);
      throw error;
    });
};

// Cette fction retourne des BookType[] ou des UserType[] (fonction générique)
export const getDocsByQueryFirebase = <T extends BookType | UserType>(
  collectionName: string,
  fieldToQuery?: string,
  valueToQuery?: string | boolean | number
): Promise<T[]> => {
  // console.log(
  //   "**********FIREBASE zzz FETCHING-1 getDocsByQueryFirebase",
  //   collectionName,
  //   fieldToQuery,
  //   valueToQuery
  // );
  const q = query(
    collection(db, collectionName),
    ...(fieldToQuery && valueToQuery
      ? [where(fieldToQuery, "==", valueToQuery)]
      : [])
  );

  //console.log("456", collectionName, fieldToQuery, valueToQuery);

  const currentUser = useUserStore.getState().currentUser;

  if (currentUser) {
    return getDocs(q)
      .then((querySnapshot) => {
        const docs: T[] = [];
        querySnapshot.forEach((doc) => {
          docs.push(doc.data() as T);
        });
        ////console.log("DOCS", docs);
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

export const getUserInfosBookFirebase = (
  userId: string | undefined,
  bookId: string,
  bookStatus: BookStatusEnum
): Promise<UserInfoBookType | null> => {
  //console.log("56 ", userId, bookId, bookStatus);
  console.log("bookInMyBooks !!!!!!!!!!!!!!", bookId, bookStatus);

  if (userId) {
    return getDocsByQueryFirebase<UserType>("users", "id", userId)
      .then((users) => {
        const user = users[0];
        console.log("bookInMyBooks !!!!!!!!!!!!!!", users[0]);
        const book = user[bookStatus].find((book) => book.id === bookId);
        console.log("bookInMyBooks !!!!!!!!!!!!!!", book);

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
  // //console.log("currentUserId", currentUserId);
  // //console.log("bookId", bookId);
  // //console.log("userViewId", userViewId);

  //console.log("***getFriendsWhoReadBookFirebase", bookId);

  if (currentUserId && bookId) {
    const q = query(collection(db, "users"), where("id", "==", currentUserId));

    return getDocs(q)
      .then((querySnapshot) => querySnapshot.docs[0].data() as UserType)
      .then((currentUser: UserType) => currentUser.friends)
      .then((currentUserFriendsIds: string[]) => {
        console.log("***CURRENT USER FRIENDS", currentUserFriendsIds);

        if (currentUserFriendsIds.length > 0) {
          const q2 = query(
            collection(db, "users"),
            where("id", "!=", userViewId),
            where("id", "in", currentUserFriendsIds) // error if currentUserFriendsIds empty
          );

          return (
            getDocs(q2)
              .then((querySnapshot) => {
                const friendsButuserViewId: UserType[] = [];
                querySnapshot.forEach((doc) => {
                  friendsButuserViewId.push(doc.data() as UserType);
                });
                return friendsButuserViewId;
              })
              .then((friendsButuserViewId) => {
                // //console.log(
                //   "***FRIENDS BUT USER ID NOT TO COUNT",
                //   friendsButuserViewId
                // );
                return friendsButuserViewId.filter((friend) =>
                  friend.booksRead.find((book) => book.id === bookId)
                );
              })
              // .THEN juste pour voir, à supp !!!!!!!!!!!!
              .then((friendsWhoReadBook) => {
                //console.log("***FRIENDS WHO READ BOOK", friendsWhoReadBook);
                return friendsWhoReadBook;
              })
              .catch((error) => {
                console.error(
                  "Error getting other users who read book: ",
                  error
                );
                throw error;
              })
          );
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
//       //console.log("USERS", users);
//       return users.filter((user) => user.id !== userId);
//     })
//     .then((otherUsers) => {
//       //console.log("OTHER USERS", otherUsers);
//       return otherUsers.map((user) => {
//         return user.booksRead.find((book) => book.bookId === bookId);
//       });
//     })
//     .then((books) => {
//       //console.log("BOOKS", books);
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

export const getUsersReadBooksIdsFirebase = (
  currentUserId: string,
  onlyFriends: boolean = false
): Promise<string[]> => {
  const queryCondition = onlyFriends
    ? ["users", "id", currentUserId]
    : ["users"];

  console.log("8888 currentUserId", currentUserId);
  console.log("8888 conditions", queryCondition);
  console.log("8888 conditions 0", queryCondition[0]);
  console.log("8888 conditions 1", queryCondition[1]);
  console.log("8888 conditions 2", queryCondition[2]);

  return (
    getDocsByQueryFirebase<UserType>(
      queryCondition[0],
      queryCondition[1],
      queryCondition[2]
    )
      // on recherche l'utilisateur coonecté
      // OU tous les utilisateurs
      .then((users) => {
        console.log("8888 users", users);
        const user = users[0];
        //console.log("888 user friends Ids", user.friends);
        if (onlyFriends) {
          return user.friends;
        } else {
          return users;
        }
      })
      // on retourne les id de ses amis
      // OU tous les utilisateurs
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
          return usersIdsOrAllUsers as UserType[]; // ici allUsers car onlFriends = false
        }
      })
      // on récupère toutes les infos des amis
      ////////////////////idem les 2
      ////////////////////idem les 2
      ////////////////////idem les 2
      ////////////////////idem les 2
      .then((users) => {
        console.log("8888 friends", users);
        return users.map((user) => {
          return user.booksRead;
          // return { friendId: friend.id, booksRead: friend.booksRead };
        });
      })
      // on récupère les info de leurs livres lus
      .then((usersBooksReadInfo) => {
        //console.log( "88888888888888 friendsBooksReadInfo",        friendsBooksReadInfo        );
        return usersBooksReadInfo.map((userBooksReadInfo) => {
          //console.log(            "888888888888999999999999 friendBooksReadInfo",            friendBooksReadInfo          );

          return userBooksReadInfo.map((book) => {
            //console.log("888888888888999999999999 book", book);
            return book.id;
          });
        });
      })
      .then((friendsBooksReadIds) => {
        //console.log("88888888888888 booksReadID", friendsBooksReadIds);
        return friendsBooksReadIds.flat();
      })
      .then((flattenedBooksReadIds) => {
        //console.log("88888888888888 RESULTATS UNIQUES", [          ...new Set(flattenedBooksReadIds),        ]);
        return [...new Set(flattenedBooksReadIds)];
      })
      // .then((friendsBooksReadIds) => {
      //   //console.log("88888888888888 booksReadID", friendsBooksReadIds);
      // })
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
    //console.log("456 findBookCatInUserLibraryFirebase");
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

        // if (user.booksRead.some((book) => book.id === bookId))
        //   result = BOOK_STATUS.READ;
        // if (user.booksInProgress.some((book) => book.id === bookId))
        //   result = BOOK_STATUS.IN_PROGRESS;
        // if (user.booksToRead.some((book) => book.id === bookId))
        //   result = BOOK_STATUS.TO_READ;

        //console.log("456 result", result);

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

// A VOIR !!!!!!!!!!!!!!!!!!
// export const findBookStatusInUserLibraryFirebase = (
//   bookId: string | undefined,
//   currentUserId: string | undefined
// ): Promise<BookStatusEnum | ""> => {
//   if (bookId && currentUserId) {
//     return getDocsByQueryFirebase<UserType>("users", "id", currentUserId).then(
//       (users) => {
//         const user = users[0];
//         let result = "";

//         if (user.booksRead.some((book) => book.id === bookId))
//           result = BookStatusEnum.booksRead;
//         if (user.booksToRead.some((book) => book.id === bookId))
//           result = BookStatusEnum.booksToRead;
//         if (user.booksInProgress.some((book) => book.id === bookId))
//           result = BookStatusEnum.booksInProgress;

//         return result;
//       }
//     );
//   }
//   return Promise.resolve("");
// };

export const isUserMyFriendFirebase = (
  friendId: string,
  currentUserId: string | undefined
): Promise<boolean> => {
  if (currentUserId) {
    return getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
      .then((users) => {
        const user = users[0];

        // //console.log(
        //   "friendId",
        //   friendId,
        //   "currentUserId",
        //   currentUserId,
        //   user.friends.some((myfriendId) => myfriendId === friendId)
        // );
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

// export const uploadImageOnFirebase = async (imageUpload: File | null) => {
//   if (imageUpload) {
//     // We create a random name for the image so that none of them have the same name
//     const imageRef = ref(
//       storage,
//       `userProfileImages/${imageUpload.name + Date.now()}`
//     );
//     try {
//       await uploadBytes(imageRef, imageUpload);
//       // Getting the URL of the uploaded image
//       const url = await getDownloadURL(imageRef);

//       return url;
//     } catch (error) {
//       console.error("Error uploading image on Firebase: ", error);
//     }
//   } else {
//     console.warn("No image provided for upload.");
//     return;
//   }
// };
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
        onProgress(progress); // Appel de la fonction de rappel pour mettre à jour la progression
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

  Promise.all([deleteUsers, deleteBooks]).then(() => {
    console.log("All datas deleted");
  });
};

export const deleteBookFromMyBooksFirebase = (
  currentUserId: string | undefined,
  bookId: string,
  bookStatus: keyof UserType | ""
): Promise<void> => {
  ////console.log("bookStatus", bookStatus);

  let noteToRemove: number;

  if (currentUserId && bookStatus !== "") {
    return (
      getDocsByQueryFirebase<UserType>("users", "id", currentUserId)
        .then((users: UserType[]) => users[0])
        .then((user: UserType) => {
          //("xxx", user);
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
            booksAccordingToStatus as UserInfoBookType[];

          // recupéré la note à supprimer
          const bookIndex = booksAccordingToStatusTyped.findIndex(
            (book) => book.id === bookId
          );
          //console.log("bookIndex", bookIndex);
          noteToRemove = booksAccordingToStatusTyped[bookIndex].userNote ?? 0;

          // //console.log("rest", rest);
          // //console.log("booksRead", booksAccordingToStatus);
          const booksReadFiltered = booksAccordingToStatusTyped.filter(
            (book: UserInfoBookType) => book.id !== bookId
          );
          //console.log("booksReadFiltered", booksReadFiltered);
          return addOrUpdateUserFirebase(currentUserId, {
            [bookStatus]: booksReadFiltered,
            ...rest,
          } as UserType);
        })
        // remove the note from the book average rating
        .then(() => {
          console.log("noteToRemove", noteToRemove);
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
