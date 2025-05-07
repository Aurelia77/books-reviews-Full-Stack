// "use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { getUser } from "@/lib/auth-session";
import Link from "next/link";
import LogOutButton from "./LogOutButton";
// import { signoutFirebase } from "@/firebase/firestore";
// import useUserStore from "@/hooks/useUserStore";
import { BookOpen, House, LogIn, Search } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Avatar, AvatarImage } from "./ui/avatar";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { DarkModeToggle } from "./DarkModeToggle";

const NavBar = async () => {
  const user = await getUser();
  // const router = useRouter();

  // A VOIR !!!!!!!
  const profileImage = false;

  return (
    <div className="sticky top-0 z-20 flex h-12 items-center bg-primary/70 p-1 text-muted shadow-md border border-amber-400">
      <p className="hidden sm:block absolute left-10 top-4 text-xs">
        {user?.email}
      </p>
      {/* <ArrowLeft
        className="absolute left-1 top-1 z-20 cursor-pointer text-muted/60"
        size={36}
        onClick={() => router.back()}
      /> */}
      <NavigationMenu>
        <NavigationMenuList className="border border-pink-600 gap-8">
          {/* ACCUEIL */}
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink asChild>
                <span
                // className={cn(
                //   navigationMenuTriggerStyle(),
                //   location.pathname === "/" &&
                //     "bg-primary/90 text-foreground"
                // )}
                >
                  <House />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {/* RECHERCHE DE LIVRES */}
          <NavigationMenuItem>
            <Link href="/searchbooks">
              <NavigationMenuLink asChild>
                <span
                // className={cn(
                //   navigationMenuTriggerStyle(),
                //   location.pathname === "/searchbooks" &&
                //     "bg-primary/90 text-foreground"
                // )}
                >
                  <Search />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {user ? (
            <div className="flex items-center gap-8">
              {/* MES LIVRES */}
              <NavigationMenuItem>
                <Link href="/mybooks">
                  <NavigationMenuLink asChild>
                    <span
                    // className={cn(
                    //   navigationMenuTriggerStyle(),
                    //   location.pathname === "/mybooks" &&
                    //     "bg-primary/90 text-foreground"
                    // )}
                    >
                      <BookOpen />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* MON COMPTE */}
              <NavigationMenuItem
              // className={cn(profileImage && "mt-1")}
              >
                <Link href={`/account`}>
                  <NavigationMenuLink asChild>
                    <span
                    // className={cn(
                    //   navigationMenuTriggerStyle(),
                    //   location.pathname === "/account" &&
                    //     "bg-primary/90 text-foreground"
                    // )}
                    >
                      {profileImage ? (
                        <Avatar className="flex items-center justify-center">
                          <AvatarImage
                            src={profileImage}
                            className="w-8 h-8 object-cover rounded-full"
                          />
                        </Avatar>
                      ) : (
                        <Avatar className="flex items-center justify-center bg-secondary rounded-full w-8 h-8">
                          {user?.email
                            ? user.email.charAt(0).toUpperCase()
                            : ""}
                        </Avatar>
                      )}
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* DECONNEXION */}
              <NavigationMenuItem>
                {/* <Link
                    href="/"
                    //</NavigationMenuItem>onClick={signoutFirebase}
                  > */}
                <LogOutButton />
                {/* <NavigationMenuLink asChild>
                    <span className={navigationMenuTriggerStyle()}>
                      <X />
                    </span>
                  </NavigationMenuLink> */}
                {/* </Link> */}
              </NavigationMenuItem>
            </div>
          ) : (
            // CONNEXION
            <NavigationMenuItem>
              <Link href="/auth/signup">
                <NavigationMenuLink asChild>
                  <span
                  // className={cn(
                  //   navigationMenuTriggerStyle(),
                  //   location.pathname === "/login" &&
                  //     "bg-primary/90 text-foreground" // Ajout de classes conditionnelles pour l'élément actif
                  // )}
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
