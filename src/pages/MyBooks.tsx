import BackPageArrow from "@/components/BackPageArrow";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyBooks = () => {
  return (
    <div>
      <BackPageArrow absolute />
      {/* <Link to="/">
        <ArrowLeft className="absolute m-1 text-primary/50" size={36} />
      </Link> */}
      <Link
        to="/mybooks/searchbook"
        className="flex w-full justify-center bg-secondary"
      >
        <p className="ml-4 p-4 text-3xl text-secondary-foreground">
          Chercher un livre
        </p>
      </Link>
      <div className="flex flex-col items-center gap-20 py-12">
        <h1 className="text-5xl">Mes livres</h1>
        <Link to="/mybooks/myreadbooks">
          <Button size="xxl" className="text-3xl">
            Livres lus
          </Button>
        </Link>
        <Link to="/mybooks/myreadbooks">
          <Button size="xxl" className="text-3xl">
            Livres en cours
          </Button>
        </Link>
        <Link to="/mybooks/myreadbooks">
          <Button size="xxl" className="text-3xl">
            Livres à lire
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyBooks;
