import { cn } from "@/utils/tailwindMerge";
import {
  TextInput as FTextInput,
  TextInputProps as FTextInputProps,
} from "flowbite-react";
import { FC } from "react";

export interface TextInputProps extends FTextInputProps {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  error?: string;
  noteText?: string;
  note?: string;
}

const TextInput: FC<TextInputProps> = ({
  id,
  label,
  containerClassName,
  labelClassName,
  className,
  error,
  style,
  noteText,
  note,
  ...props
}) => {
  return (
    <div className={cn(containerClassName)}>
      <div
        className={cn(
          "flex w-full",
          label
            ? "flex-col lg:flex-row lg:items-center lg:gap-9"
            : "justify-center items-center"
        )}
      >
        {label && (
          <label
            className={cn(
              "flex ml-1 font-bold text-lg sm:text-xl lg:w-[50%] capitalize",
              labelClassName
            )}
            htmlFor={id}
          >
            {label?.toLowerCase()}
          </label>
        )}

        <div className="w-full">
          <FTextInput
            style={{
              borderRadius: 0,
              borderWidth: 0,
              ...style,
            }}
            className={cn(label ? "w-full" : "w-full text-center", className)}
            id={id}
            name={id}
            {...props}
          />

          <p className=" mt-1">
            <span className="text-bright-green">{note} </span> {noteText}
          </p>
        </div>
      </div>

      {Boolean(error) && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default TextInput;
