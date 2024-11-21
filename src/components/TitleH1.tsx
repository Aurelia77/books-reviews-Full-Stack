const Title = ({ children }: { children: string }): JSX.Element => {
  return <h1 className="px-3 py-7 text-4xl text-foreground">{children}</h1>;
};

export default Title;
