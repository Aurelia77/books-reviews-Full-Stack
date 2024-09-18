import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-20 py-12">
      <Link to="/mybooks">
        <Button size="xxl" className="text-3xl text-primary-foreground">
          Mes livres
        </Button>
      </Link>
      <Link to="/mybooks">
        <Button size="xxl" className="text-3xl text-primary-foreground">
          Livres de mes amis
        </Button>
      </Link>
      <Link to="/mybooks">
        <Button size="xxl" className="text-3xl text-primary-foreground">
          Suggestions
        </Button>
      </Link>
    </div>
  );
};

export default Home;
