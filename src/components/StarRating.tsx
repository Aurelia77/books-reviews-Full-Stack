import { Star, StarHalf } from "lucide-react"; // Ajout de StarHalf

type StarRatingProps = {
  value: number;
  onChange?: (value: string) => void;
  forReadBook?: boolean;
};

const StarRating = ({
  value,
  onChange,
  forReadBook = false,
}: StarRatingProps): JSX.Element => {
  const handleClick = (index: number) => {
    if (onChange) onChange((index + 1).toString());
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const isHalf = value - index === 0.5;
        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="cursor-pointer"
          >
            {isHalf ? (
              <div className="relative">
                <Star
                  color="#878787"
                  strokeWidth={0.5}
                  className="size-6 text-gray-300"
                  fill="currentColor"
                />
                <StarHalf
                  color="#878787"
                  strokeWidth={0.5}
                  className="absolute left-0 top-0 size-6 text-secondary"
                  fill="currentColor"
                />
              </div>
            ) : (
              <Star
                color="#878787"
                strokeWidth={0.5}
                className={`size-6 ${index < Math.round(value) ? (forReadBook ? "text-green-500" : "text-secondary") : "text-gray-300"}`}
                fill="currentColor"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
