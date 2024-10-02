import { ThemeProvider } from "@/components/Theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AccountPage from "./pages/AccountPage";
import BookDetailPage from "./pages/BookDetailPage";
import BooksSearchPage from "./pages/BooksSearchPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyBooksPage from "./pages/MyBooksPage";
import MyReadBooksPage from "./pages/MyReadBooksPage";
import RegisterPage from "./pages/RegisterPage";

const App = (): JSX.Element => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="inline h-auto min-h-screen bg-background text-foreground">
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mybooks" element={<MyBooksPage />} />
            <Route path="/mybooks/myreadbooks" element={<MyReadBooksPage />} />
            <Route path="/mybooks/searchbook" element={<BooksSearchPage />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
