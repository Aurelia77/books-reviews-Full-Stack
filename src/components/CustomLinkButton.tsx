import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const CustomLinkButton = ({
  children,
  opacity = 40,
  linkTo = "/",
}: {
  children: string;
  opacity?: number;
  linkTo?: string;
}) => {
  const opacityClass = `bg-primary/${opacity}`;
  return (
    console.log("opacity", opacity),
    (
      <Link to={linkTo} className="w-full">
        <Button
          size="xxl"
          // className={`w-full text-3xl text-primary-foreground bg-primary/${opacity}`}
          className={cn(
            "w-full text-3xl text-primary-foreground",
            opacityClass
          )}
        >
          {children}
        </Button>
      </Link>
    )
  );
};

export default CustomLinkButton;
