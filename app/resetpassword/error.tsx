"use client";

import FeedbackMessage from "@/components/FeedbackMessage";

const ResetPasswordError = ({ error }: { error: Error }) => {
  return (
    <div className="mt-32">
      <FeedbackMessage
        message={`Une erreur est survenue : ${error.message}`}
        type="error"
      />
    </div>
  );
};

export default ResetPasswordError;
