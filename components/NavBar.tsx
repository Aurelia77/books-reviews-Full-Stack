import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getConnectedUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { BookOpen, House, LogIn, Search } from "lucide-react";
import Link from "next/link";
import BackArrow from "./BackArrow";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import NavItem from "./NavItem";
import { Avatar, AvatarImage } from "./ui/avatar";

const NavBar = async () => {
  const currentUser = await getConnectedUser();

  let profileImage = null;

  if (currentUser) {
    try {
      profileImage = await prisma.appUser.findUnique({
        where: {
          id: currentUser?.id,
        },
        select: {
          imgURL: true,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'image de profil :",
        error
      );
    }
  }

  return (
    <div className="sticky top-0 z-20 flex h-12 items-center bg-primary/70 p-1 text-muted shadow-md">
      <p className="hidden sm:block absolute left-10 top-4 text-xs">
        {currentUser?.email}
      </p>
      <BackArrow />
      <NavigationMenu>
        <NavigationMenuList>
          {/* HOME */}
          <NavItem href="/">
            <House />
          </NavItem>
          {/* BOOK SEARCH */}
          <NavItem href="/books">
            <Search />
          </NavItem>

          {currentUser ? (
            <div className="flex items-center">
              {/* MY BOOKS */}
              <NavItem href="/mybooks">
                <BookOpen />
              </NavItem>

              {/* MY ACCOUNT */}
              <NavItem href="/myaccount">
                {profileImage?.imgURL ? (
                  <Avatar className="flex items-center justify-center">
                    <AvatarImage
                      src={profileImage.imgURL}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  </Avatar>
                ) : (
                  <Avatar className="flex items-center justify-center bg-secondary rounded-full w-8 h-8">
                    {currentUser?.email
                      ? currentUser.email.charAt(0).toUpperCase()
                      : ""}
                  </Avatar>
                )}
              </NavItem>
              {/* LOGOUT */}
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
            // LOGIN
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
