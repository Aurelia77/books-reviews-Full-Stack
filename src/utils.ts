export const removeOrRemplaceHtmlTags = (description: string) => {
  return (
    description
      // Supprimer toutes les balises HTML
      .replace(/<\/?[^>]+(>|$)/g, "")
      // Remplacer les balises <br> par des sauts de ligne
      .replace(/<br\s*\/?>\s*(<br\s*\/?>)*/g, "\n")
  );
};
