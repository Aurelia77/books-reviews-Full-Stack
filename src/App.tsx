import { ThemeProvider } from "@/components/Theme-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import BookDetailPage from "./pages/BookDetailPage";
import BooksSearchPage from "./pages/BooksSearchPage";
import FriendsBooksReadPage from "./pages/FriendsBooksReadPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyAccountPage from "./pages/MyAccountPage";
import MyBooksPage from "./pages/MyBooksPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserAccountPage from "./pages/UserAccountPage";
import UsersSearchPage from "./pages/UsersSearchPage";
import NotFound404Page from "./pages/NotFound404Page";

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
              <Route
                path="/mybooks/searchbooks"
                element={<BooksSearchPage />}
              />
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
              <Route
                path="/friendsbooksread"
                element={<FriendsBooksReadPage />}
              />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFound404Page />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
