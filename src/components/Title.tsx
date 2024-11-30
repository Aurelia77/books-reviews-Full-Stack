const Title = ({
  children,
  level = 1,
}: {
  children: string;
  level?: number;
}): JSX.Element => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

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
    <Tag className={`${paddingClass} ${textSizeClass} text-foreground`}>
      {children}
    </Tag>
  );
};

export default Title;
