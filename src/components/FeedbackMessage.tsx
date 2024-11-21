import { cn } from "@/lib/utils";

const FeedbackMessage = ({
  message,
  type = "info",
}: {
  message: string;
  type?: "info" | "error";
}): JSX.Element => {
  const messageClass = cn(
    "mb-8 mx-[10%] p-4 rounded-md text-center",
    // type === "info" && "bg-blue-100 text-blue-700",
    // type === "error" && "text-destructive-foreground border border-red-700"
    {
      "text-muted border border-muted bg-primary/50": type === "info",
      "text-destructive-foreground border border-destructive-foreground bg-destructive-foreground/15":
        type === "error",
    }
  );

  return <div className={messageClass}>{message}</div>;
};

export default FeedbackMessage;
