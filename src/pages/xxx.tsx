import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type InputsFormType = {
  bookTitle: string;
  bookStatus: BookStatusEnum;
};

enum BookStatusEnum {
  read = "read",
  inProgress = "inProgress",
  toRead = "toRead",
}

const NewBook = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InputsFormType>();

  const onSubmit: SubmitHandler<InputsFormType> = (data) => console.log(data);
  console.log(watch("bookTitle"));

  return (
    <div>
      <form
        className="flex flex-col gap-2 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="text"
          placeholder="Titre"
          {...register("bookTitle", {
            required: true,
          })}
        />
        {errors.bookTitle && (
          <span className="font-bold text-destructive">Entrer un titre</span>
        )}
        <RadioGroup defaultValue={BookStatusEnum.read}>
          <Controller
            name="bookStatus"
            control={control}
            defaultValue={BookStatusEnum.read}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={BookStatusEnum.read} id="read" />
                  <Label htmlFor="read">Lu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={BookStatusEnum.inProgress}
                    id="inProgress"
                  />
                  <Label htmlFor="inProgress">En cours</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={BookStatusEnum.toRead} id="toRead" />
                  <Label htmlFor="toRead">À lire</Label>
                </div>
              </RadioGroup>
            )}
          />
        </RadioGroup>
        <Button type="submit">Ajouter</Button>
      </form>
    </div>
  );
};

export default NewBook;
