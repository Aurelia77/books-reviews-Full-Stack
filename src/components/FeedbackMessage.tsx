import { cn } from "@/lib/utils";

const FeedbackMessage = ({
  message,
  type = "info",
  className,
}: {
  message: string;
  type?: "info" | "error";
  className?: string;
}): JSX.Element => {
  const messageClass = cn(
    "my-8 mx-[10%] p-4 rounded-md text-center",
    {
      "text-muted border border-muted bg-primary/50": type === "info",
      "text-destructive-foreground border border-destructive-foreground bg-destructive-foreground/15":
        type === "error",
    },
    className
  );

  return <div className={messageClass}>{message}</div>;
};

export default FeedbackMessage;
