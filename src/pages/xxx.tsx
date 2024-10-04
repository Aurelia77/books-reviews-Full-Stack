import React, { useState, useEffect, useRef } from "react";
import { Input } from "@shadcn/ui"; // Assurez-vous d'importer correctement votre composant Input
import { getAllDocsFromCollection } from "./firebase"; // Assurez-vous d'importer la fonction appropriée

const MAX_RESULTS = 5;

const getRandomChar = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return chars[Math.floor(Math.random() * chars.length)];
};

const BooksSearchPage = () => {
  const [databaseBooks, setDatabaseBooks] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const author = "J.K. Rowling"; // Exemple d'auteur

  useEffect(() => {
    // Mettre le focus sur l'input
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Construire l'URL de l'API avec l'auteur
    const query = `${getRandomChar()}+inauthor:${encodeURIComponent(author)}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${MAX_RESULTS}`;

    // Récupérer les livres de l'API
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.items) {
          throw new Error("No items found in the response");
        }
        const booksFromAPI = data.items.map((book: any) => ({
          bookId: book.id,
          bookTitle: book.volumeInfo.title,
          bookAuthor: book.volumeInfo?.authors?.[0] ?? "Auteur inconnu",
          bookDescription: book.volumeInfo.description,
          bookCategories: book.volumeInfo.categories,
          bookPageCount: book.volumeInfo.pageCount,
          bookPublishedDate: book.volumeInfo.publishedDate,
          bookPublisher: book.volumeInfo.publisher,
          bookImageLink: book.volumeInfo.imageLinks?.thumbnail,
          bookLanguage: book.volumeInfo.language,
          bookIsFromAPI: true,
        }));
        setDatabaseBooks(booksFromAPI);
        setError(null); // Réinitialiser l'erreur en cas de succès
      })
      .catch((error) => {
        console.error("Error fetching books: ", error);
        setError("Une erreur est survenue lors de la récupération des livres.");
      });
  }, []);

  return (
    <div>
      <Input
        ref={inputRef}
        placeholder="Titre"
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Afficher le message d'erreur si une erreur est survenue */}
      {error && <div className="error-message">{error}</div>}
      {/* Autres composants et logique */}
    </div>
  );
};

export default BooksSearchPage;
