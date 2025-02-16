import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange?: (value: string) => void;
};

const StarRating = ({ value, onChange }: StarRatingProps): JSX.Element => {
  //const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const handleClick = (index: number) => {
    if (onChange) onChange((index + 1).toString());
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          color="#878787"
          strokeWidth={0.5}
          key={index}
          onClick={() => handleClick(index)}
          className={`size-6 cursor-pointer ${
            index < Math.round(value) ? "text-secondary" : "text-gray-300"
          }`}
          fill="currentColor"
          //viewBox="0 0 20 20"
        />
      ))}
    </div>

    // <div className="flex">
    //   {[...Array(5)].map((_, index) => (
    //     <svg
    //       key={index}
    //       onClick={() => handleClick(index)}
    //       className={`size-6 cursor-pointer ${
    //         index < value ? "text-yellow-500" : "text-gray-300"
    //       }`}
    //       fill="currentColor"
    //       viewBox="0 0 20 20"
    //     >
    //       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.176 0l-3.39 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.34 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
    //     </svg>
    //   ))}
    // </div>
  );
};

export default StarRating;
