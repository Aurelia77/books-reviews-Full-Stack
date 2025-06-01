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
import { ArrowLeft, BookOpen, House, LogIn, Search, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";
import { Avatar, AvatarImage } from "./ui/avatar";

const NavBar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, profileImage } = useUserStore();

  return (
    <div className="sticky top-0 z-20 flex h-12 items-center bg-primary/70 p-1 text-muted shadow-md">
      <p className="absolute left-10 top-4 hidden text-xs sm:block">
        {currentUser?.email}
      </p>
      <ArrowLeft
        className="absolute left-1 top-1 z-20 cursor-pointer text-muted/60"
        size={36}
        onClick={() => navigate(-1)}
      />
      <NavigationMenu className="ml-8">
        <NavigationMenuList>
          {/* HOME */}
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
          {/* BOOK SEARCH */}
          <NavigationMenuItem>
            <Link to="/searchbooks">
              <NavigationMenuLink asChild>
                <span
                  className={cn(
                    navigationMenuTriggerStyle(),
                    location.pathname === "/searchbooks" &&
                      "bg-primary/90 text-foreground"
                  )}
                >
                  <Search />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {currentUser ? (
            <div className="flex items-center gap-1">
              {/* MY BOOKS */}
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
              {/* MON ACCOUNT */}
              <NavigationMenuItem className={cn(profileImage && "mt-1")}>
                <Link to={`/account`}>
                  <NavigationMenuLink asChild>
                    <span
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/account" &&
                          "bg-primary/90 text-foreground"
                      )}
                    >
                      {profileImage ? (
                        <Avatar className="flex items-center justify-center">
                          <AvatarImage
                            src={profileImage}
                            className="size-8 rounded-full object-cover"
                          />
                        </Avatar>
                      ) : (
                        <Avatar className="flex size-8 items-center justify-center rounded-full bg-secondary">
                          {currentUser?.email
                            ? currentUser.email.charAt(0).toUpperCase()
                            : ""}
                        </Avatar>
                      )}
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* LOGOUT */}
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
            // LOGIN
            <NavigationMenuItem>
              <Link to="/login">
                <NavigationMenuLink asChild>
                  <span
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/login" &&
                        "bg-primary/90 text-foreground"
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
