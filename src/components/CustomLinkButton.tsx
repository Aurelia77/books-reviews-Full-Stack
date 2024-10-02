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
    <Link to={linkTo} className="w-full">
      <Button
        size="xxl"
        className={cn(
          "w-full sm:w-[50%] text-3xl rounded-none sm:rounded-md",
          className
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

export default CustomLinkButton;
