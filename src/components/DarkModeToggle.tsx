import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/Theme-provider";
import { Button } from "@/components/ui/button";

export function DarkModeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();

  console.log("theme", theme);

  const inverseTheme = () =>
    theme === "light" ? setTheme("dark") : setTheme("light");

  return (
    <Button variant="outline" size="icon" onClick={() => inverseTheme()}>
      <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
