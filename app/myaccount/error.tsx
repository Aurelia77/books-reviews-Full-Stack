"use client";

import FeedbackMessage from "@/components/FeedbackMessage";

const UsersError = ({ error }: { error: Error }) => {
  return (
    <FeedbackMessage
      message={`Une erreur est survenue : ${error.message}`}
      type="error"
      className="mt-26"
    />
  );
};

export default UsersError;
