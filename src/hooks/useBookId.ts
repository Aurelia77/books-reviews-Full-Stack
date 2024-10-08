import { getBooksByQueryFirebase } from "@/firebase";
import { BookType } from "@/types";
import useSWR from "swr";

const fetchBookInfo = async (bookId: string): Promise<BookType | null> => {
  // et avec .then ?????
  try {
    const books = await getBooksByQueryFirebase("books", "bookId", bookId);
    if (books.length > 0) {
      return books[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching book with bookId: ${bookId}`, error);
    return null;
  }
};

const useBookId = (bookId?: string) => {
  if (!bookId) {
    return {
      data: null,
      error: null,
      isLoading: false,
    };
  }

  const { data, error, isLoading } = useSWR<BookType | null>(
    bookId,
    fetchBookInfo
  );
  // } = useSWR<BookType>(bookId, fetcher);

  return { data, error, isLoading };
};

export default useBookId;
