"use client";

import FeedbackMessage from "@/components/FeedbackMessage";

const BooksError = ({ error }: { error: Error }) => {
  return (
    <div>
      <FeedbackMessage
        message={`Une erreur est survenue : ${error.message}`}
        type="error"
        className="mt-26"
      />
    </div>
  );
};

export default BooksError;
