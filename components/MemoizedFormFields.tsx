import { X } from "lucide-react";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import StarRating from "./StarRating";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
const currentYear = new Date().getFullYear();
import { MONTHS } from "@/lib/constants";
import { MyInfoBookFormType } from "@/lib/types";

const MemoizedFormFields = memo(function ReadFields({
  year,
  month,
  userNote,
  setValue,
  control,
}: {
  year: number | undefined;
  month: number | undefined;
  userNote: number | undefined;
  setValue: (name: keyof MyInfoBookFormType, value: any) => void;
  control: any;
}) {
  return (
    <div className="flex items-center justify-around">
      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                value={year?.toString() ?? ""}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    {
                      length: currentYear - 1900 + 1,
                    },
                    (_, i) => currentYear - i
                  ).map((yearOpt) => (
                    <SelectItem key={yearOpt} value={yearOpt.toString()}>
                      {yearOpt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="month"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                value={month?.toString() ?? ""}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mois (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((monthOpt, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {monthOpt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="userNote"
        render={() => (
          <FormItem className="flex justify-center">
            <FormControl>
              <Controller
                name="userNote"
                control={control}
                render={({ field }) => (
                  <StarRating
                    value={field.value ?? 0}
                    onChange={(value: string) =>
                      field.onChange(parseInt(value))
                    }
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {userNote !== 0 && <X onClick={() => setValue("userNote", 0)} />}
    </div>
  );
});

export default MemoizedFormFields;
