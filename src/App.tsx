import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import MyReadBooks from "./pages/MyReadBooks";
import NewBook from "./pages/NewBook";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/mybooks/myreadbooks" element={<MyReadBooks />} />
        <Route path="/mybooks/addbook" element={<NewBook />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
