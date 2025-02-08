import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="sticky bottom-0 bg-primary/70 text-center">
      Application Book Review 2025 -{" "}
      <Link to="https://portfolio-aurelia-2024.vercel.app/">
        Aurélia Heymann
      </Link>
    </div>
  );
};

export default Footer;
