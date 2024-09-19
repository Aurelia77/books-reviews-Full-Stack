import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookDetailPage from "./pages/BookDetailPage";
import BookSearch from "./pages/BookSearch";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import MyReadBooks from "./pages/MyReadBooks";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/mybooks/myreadbooks" element={<MyReadBooks />} />
        <Route path="/mybooks/searchbook" element={<BookSearch />} />
        <Route
          path="/mybooks/searchbook/:bookId"
          element={<BookDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
