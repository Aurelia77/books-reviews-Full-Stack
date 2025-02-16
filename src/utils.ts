export const cleanDescription = (description: string) => {
  return (
    description
      // Supprimer toutes les balises HTML
      .replace(/<\/?[^>]+(>|$)/g, "")
      // Remplacer les balises <br> par des sauts de ligne
      .replace(/<br\s*\/?>\s*(<br\s*\/?>)*/g, "\n")
      // Supprimer les guillemets français et anglais en début et fin de texte
      .replace(/^[«"]+|[»"]+$/g, "")
  );
};
