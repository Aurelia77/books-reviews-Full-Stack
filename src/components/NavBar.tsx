import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ArrowLeft, CircleUserRound, House, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ArrowLeft
        className="absolute left-1 top-1 z-30 cursor-pointer text-primary/50"
        size={36}
        onClick={() => navigate(-1)}
      />
      <NavigationMenu className="sticky top-0 h-12 border shadow-md">
        <NavigationMenuList className="">
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
          <NavigationMenuItem>
            <Link to="/account">
              <NavigationMenuLink asChild>
                <span className={navigationMenuTriggerStyle()}>
                  <CircleUserRound />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavBar;
