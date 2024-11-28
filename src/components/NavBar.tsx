import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { signoutFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BookOpen,
  CircleUserRound,
  House,
  LogIn,
  Search,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";

const NavBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useUserStore();
  console.log("USER", user?.email);

  return (
    <div className="sticky top-0 z-20 flex h-12 items-center bg-primary/70 p-1 text-muted shadow-md">
      <p>USER : {user?.email}</p>
      <ArrowLeft
        className="absolute left-1 top-1 z-20 cursor-pointer text-muted/60"
        size={36}
        //onClick={handleBackClick}
        onClick={() => navigate(-1)}
      />
      <NavigationMenu className="ml-8">
        <NavigationMenuList>
          {/* ACCUEIL */}
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink asChild>
                <span
                  className={cn(
                    navigationMenuTriggerStyle(),
                    location.pathname === "/" && "bg-primary/90 text-foreground"
                  )}
                >
                  <House />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {/* RECHERCHE DE LIVRES */}
          <NavigationMenuItem>
            <Link to="/mybooks/searchbook">
              <NavigationMenuLink asChild>
                <span
                  className={cn(
                    navigationMenuTriggerStyle(),
                    location.pathname === "/mybooks/searchbook" &&
                      "bg-primary/90 text-foreground"
                  )}
                >
                  <Search />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {user ? (
            <div className="flex gap-1">
              {/* MES LIVRES */}
              <NavigationMenuItem>
                <Link to="/mybooks">
                  <NavigationMenuLink asChild>
                    <span
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/mybooks" &&
                          "bg-primary/90 text-foreground"
                      )}
                    >
                      <BookOpen />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* MON COMPTE */}
              <NavigationMenuItem>
                <Link to="/account">
                  <NavigationMenuLink asChild>
                    <span
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/account" &&
                          "bg-primary/90 text-foreground"
                      )}
                    >
                      <CircleUserRound />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* DECONNEXION */}
              <NavigationMenuItem>
                <Link to="/" onClick={signoutFirebase}>
                  <NavigationMenuLink asChild>
                    <span className={navigationMenuTriggerStyle()}>
                      <X />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </div>
          ) : (
            // CONNEXION
            <NavigationMenuItem>
              <Link to="/login">
                <NavigationMenuLink asChild>
                  <span
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/login" &&
                        "bg-primary/90 text-foreground" // Ajout de classes conditionnelles pour l'élément actif
                    )}
                  >
                    <LogIn />
                  </span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <DarkModeToggle />
    </div>
  );
};

export default NavBar;
