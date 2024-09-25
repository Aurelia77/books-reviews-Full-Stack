const Title = ({ children }: { children: string }): JSX.Element => {
  return <h1 className="mx-3 my-7 text-4xl text-foreground">{children}</h1>;
};

export default Title;
