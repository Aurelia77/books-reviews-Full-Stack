import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackPageArrow = ({ absolute = false }: { absolute?: boolean }) => {
  const navigate = useNavigate();

  return (
    <div>
      <ArrowLeft
        className={clsx("m-1 text-primary/50", absolute ? "absolute" : "")}
        size={36}
        onClick={() => navigate(-1)}
      />
    </div>
  );
};

export default BackPageArrow;
