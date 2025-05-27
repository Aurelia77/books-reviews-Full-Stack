"use client";

import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";

const BooksError = ({ error }: { error: Error }) => {
  return (
    <div>
      <Title>Affichage d'un ou plusieurs livre(s)</Title>
      <FeedbackMessage
        message={`Une erreur est survenue : ${error.message}`}
        type="error"
        className="mt-26"
      />
    </div>
  );
};

export default BooksError;
