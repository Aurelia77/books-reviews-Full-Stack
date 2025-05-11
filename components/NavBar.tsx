// "use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getUser } from "@/lib/auth-session";
import Link from "next/link";
import LogOutButton from "./LogOutButton";
// import { signoutFirebase } from "@/firebase/firestore";
// import useUserStore from "@/hooks/useUserStore";
import { cn } from "@/lib/utils";
import { BookOpen, House, LogIn, Search } from "lucide-react";
import BackArrow from "./BackArrow";
import { DarkModeToggle } from "./DarkModeToggle";
import NavItem from "./NavItem";
import { Avatar, AvatarImage } from "./ui/avatar";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { DarkModeToggle } from "./DarkModeToggle";

const NavBar = async () => {
  const user = await getUser();
  // const router = useRouter();

  // A VOIR !!!!!!!
  const profileImage = false;

  return (
    <div className="sticky top-0 z-20 flex h-12 items-center bg-primary/70 p-1 text-muted shadow-md">
      <p className="hidden sm:block absolute left-10 top-4 text-xs">
        {user?.email}
      </p>
      <BackArrow />
      <NavigationMenu>
        <NavigationMenuList>
          {/* ACCUEIL */}
          <NavItem href="/">
            <House />
          </NavItem>
          {/* RECHERCHE DE LIVRES */}
          <NavItem href="/books">
            <Search />
          </NavItem>

          {user ? (
            <div className="flex items-center">
              {/* MES LIVRES */}
              <NavItem href="/mybooks">
                <BookOpen />
              </NavItem>

              {/* MON COMPTE */}
              <NavItem href="/account">
                {profileImage ? (
                  <Avatar className="flex items-center justify-center">
                    <AvatarImage
                      src={profileImage}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  </Avatar>
                ) : (
                  <Avatar className="flex items-center justify-center bg-secondary rounded-full w-8 h-8">
                    {user?.email ? user.email.charAt(0).toUpperCase() : ""}
                  </Avatar>
                )}
              </NavItem>
              {/* DECONNEXION */}
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink asChild>
                    <span className={cn(navigationMenuTriggerStyle())}>
                      <LogOutButton />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </div>
          ) : (
            // CONNEXION
            <NavItem href="/auth/signin">
              <LogIn />
            </NavItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <DarkModeToggle />
    </div>
  );
};

export default NavBar;
