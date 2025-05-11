"use client";

import FeedbackMessage from "@/components/FeedbackMessage";

export default function ErrorUsers({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mt-32">
      <FeedbackMessage
        message={`Une erreur est survenue : ${error.message}`}
        type="error"
      />
    </div>
  );
}
