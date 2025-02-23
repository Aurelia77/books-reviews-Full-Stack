import { ThemeProvider } from "@/components/Theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import BookDetailPage from "./pages/BookDetailPage";
import BooksSearchPage from "./pages/BooksSearchPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyAccountPage from "./pages/MyAccountPage";
import MyBooksPage from "./pages/MyBooksPage";
import NotFound404Page from "./pages/NotFound404Page";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserAccountPage from "./pages/UserAccountPage";
import UsersBooksReadPage from "./pages/UsersBooksReadPage";
import UsersSearchPage from "./pages/UsersSearchPage";
import AdminPage from "./pages/AdminPage";

const App = (): JSX.Element => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="h-auto min-h-screen bg-background text-foreground">
        <BrowserRouter>
          <NavBar />
          <div className="mb-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/mybooks" element={<MyBooksPage />} />
              <Route path="/searchbooks" element={<BooksSearchPage />} />
              <Route
                path="/mybooks/searchbooks/authors/:author"
                element={<BooksSearchPage />}
              />
              <Route path="/books/:bookId" element={<BookDetailPage />} />
              <Route path="/account" element={<MyAccountPage />} />
              <Route path="/account/:userId?" element={<UserAccountPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/searchusers" element={<UsersSearchPage />} />
              <Route path="/usersbooksread" element={<UsersBooksReadPage />} />
              <Route
                path="/allusersbooksread"
                element={<UsersBooksReadPage />}
              />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFound404Page />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
