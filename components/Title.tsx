import React from "react";

interface TitleProps {
  children: string;
  level?: number;
}

const Title: React.FC<TitleProps> = ({ children, level = 1 }) => {
  const textSizeClass =
    level === 1
      ? "text-4xl"
      : level === 2
      ? "text-2xl"
      : level === 3
      ? "text-1xl"
      : "text-xl";

  const paddingClass = level === 1 ? "px-3 py-7" : "p-3";

  return (
    <h1 className={`${paddingClass} ${textSizeClass} text-foreground`}>
      {children}
    </h1>
  );
};

export default Title;
