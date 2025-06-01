"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";

const NavItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuItem>
      <Link href={href}>
        <NavigationMenuLink asChild>
          <span
            className={cn(
              navigationMenuTriggerStyle(),
              isActive && "bg-primary/90 text-foreground"
            )}
          >
            {children}
          </span>
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};

export default NavItem;
