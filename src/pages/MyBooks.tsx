import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyBooks = () => {
  return (
    <div>
      <Link to="/mybooks/addbook">
        <Button
          size="xxl"
          className="bg-secondary text-3xl text-secondary-foreground"
        >
          Ajouter un livre
        </Button>
      </Link>
      <div className="flex flex-col items-center gap-20 py-12">
        <h1 className="text-5xl">Mes livres</h1>
        <Link to="/mybooks/myreadbooks">
          <Button size="xxl" className="text-3xl">
            Livres lus
          </Button>
        </Link>
        <Link to="/myreadbook">
          <Button size="xxl" className="text-3xl">
            Livres en cours
          </Button>
        </Link>
        <Link to="/myreadbook">
          <Button size="xxl" className="text-3xl">
            Livres à lire
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyBooks;
