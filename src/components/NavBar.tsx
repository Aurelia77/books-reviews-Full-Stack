import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  ArrowLeft,
  CircleUserRound,
  House,
  LogIn,
  LogOut,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";

const NavBar = (): JSX.Element => {
  const navigate = useNavigate();

  const [isConnected, setIsConnected] = useState(false); // A SUPP QD AUTH FAIT

  return (
    <div className="sticky top-0 z-20 flex h-12 items-center bg-secondary/70 p-1 text-primary-foreground shadow-md">
      <ArrowLeft
        className="absolute left-1 top-1 z-20 cursor-pointer text-foreground"
        size={36}
        //onClick={handleBackClick}
        onClick={() => navigate(-1)}
      />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink asChild>
                <span className={navigationMenuTriggerStyle()}>
                  <House />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/mybooks/searchbook">
              <NavigationMenuLink asChild>
                <span className={navigationMenuTriggerStyle()}>
                  <Search />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {isConnected ? (
            <div className="flex gap-1">
              <NavigationMenuItem>
                <Link to="/account">
                  <NavigationMenuLink asChild>
                    <span className={navigationMenuTriggerStyle()}>
                      <CircleUserRound />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/" onClick={() => setIsConnected(false)}>
                  <NavigationMenuLink asChild>
                    <span className={navigationMenuTriggerStyle()}>
                      <LogOut />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </div>
          ) : (
            <NavigationMenuItem>
              <Link to="/login" onClick={() => setIsConnected(true)}>
                <NavigationMenuLink asChild>
                  <span className={navigationMenuTriggerStyle()}>
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
