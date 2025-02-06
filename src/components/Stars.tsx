import { Sparkles } from "lucide-react";

const Stars = (): JSX.Element => {
  return (
    <div className="flex items-center gap-2">
      <Sparkles
        size={48}
        strokeWidth={3}
        className="absolute left-[3.8rem] top-3 drop-shadow-sm text-stroke-lg"
        color="white"
      />
      <Sparkles
        className="absolute left-16 top-[0.95rem] drop-shadow-sm text-stroke-lg"
        size={42}
        color="gray"
      />
      <Sparkles />
    </div>
  );
};

export default Stars;
