import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

type CustomLinkButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  children: string;
  //opacity?: number;
  linkTo?: string;
  className?: string;
};

const CustomLinkButton = ({
  children,
  linkTo = "/",
  className,
}: CustomLinkButtonProps): JSX.Element => {
  return (
    <Link to={linkTo}>
      <Button
        size="xxl"
        className={cn(
          "w-full text-3xl rounded-none sm:rounded-md border border-border shadow-md shadow-foreground/30",
          className
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

export default CustomLinkButton;
