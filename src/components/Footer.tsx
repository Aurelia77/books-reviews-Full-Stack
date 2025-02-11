import { APP_NAME } from "@/constants";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="sticky bottom-0 bg-primary/70 text-center">
      Application {APP_NAME} 2025 -{" "}
      <Link
        to="https://portfolio-aurelia-2024.vercel.app/"
        className="underline"
      >
        Aurélia Heymann
      </Link>
    </div>
  );
};

export default Footer;
