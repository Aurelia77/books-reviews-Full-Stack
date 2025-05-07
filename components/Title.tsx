import React from "react";

interface TitleProps {
  children: string;
  className?: string;
}

const Title: React.FC<TitleProps> = ({ children, className }) => {
  return <h1 className={className}>{children}</h1>;
};

export default Title;
