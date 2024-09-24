import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AccountPage from "./pages/AccountPage";
import BookDetailPage from "./pages/BookDetailPage";
import BookSearch from "./pages/BookSearch";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import MyReadBooks from "./pages/MyReadBooks";

const App = () => {
  return (
    <div className="bg-purple-200">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mybooks" element={<MyBooks />} />
          <Route path="/mybooks/myreadbooks" element={<MyReadBooks />} />
          <Route path="/mybooks/searchbook" element={<BookSearch />} />
          <Route
            path="/mybooks/searchbook/:bookId"
            element={<BookDetailPage />}
          />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
