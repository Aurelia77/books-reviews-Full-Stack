import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

type CustomLinkButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  children: string;
  opacity?: number;
  linkTo?: string;
};

const CustomLinkButton = ({
  children,
  opacity = 40,
  linkTo = "/",
  ...props
}: CustomLinkButtonProps): JSX.Element => {
  // VOIR SI ON SUPP
  // Ajouter cet objet car TailwindCSS ne génére pas les classes dynamiques à la volée
  // const opacityClasses: { [key: number]: string } = {
  //   0: "bg-muted-foreground/0",
  //   5: "bg-muted-foreground/5",
  //   10: "bg-muted-foreground/10",
  //   15: "bg-muted-foreground/15",
  //   20: "bg-muted-foreground/20",
  //   25: "bg-muted-foreground/25",
  //   30: "bg-muted-foreground/30",
  //   35: "bg-muted-foreground/35",
  //   40: "bg-muted-foreground/40",
  //   45: "bg-muted-foreground/45",
  //   50: "bg-muted-foreground/50",
  //   55: "bg-muted-foreground/55",
  //   60: "bg-muted-foreground/60",
  //   65: "bg-muted-foreground/65",
  //   70: "bg-muted-foreground/70",
  //   75: "bg-muted-foreground/75",
  //   80: "bg-muted-foreground/80",
  //   85: "bg-muted-foreground/85",
  //   90: "bg-muted-foreground/90",
  //   95: "bg-muted-foreground/95",
  //   100: "bg-muted-foreground/100",
  // };

  const generateBgClass = (nb: number) => `bg-muted-foreground/${nb}`;

  return (
    <Link to={linkTo} className="w-full">
      <Button
        size="xxl"
        className={cn(
          "w-full text-3xl text-muted-foreground-foreground",
          generateBgClass(opacity)
          //opacityClasses[opacity]
        )}
        {...props}
      >
        {children}
      </Button>
    </Link>
  );
};

export default CustomLinkButton;
