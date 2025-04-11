import { cn } from "@/utils/tailwindMerge";
import { Textarea, TextareaProps } from "flowbite-react";
import { FC } from "react";

export interface TextAreaProps extends TextareaProps {
  label?: string;
  vertical?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  noteText?: string;
  note?: string;
}

const TextArea: FC<TextAreaProps> = ({
  vertical,
  containerClassName,
  labelClassName,
  label,
  style,
  noteText,
  note,
  ...props
}) => {
  return (
    <div
      className={cn(
        `xl:flex xl:flex-1 lg:flex lg:flex-1 gap-9 ${
          vertical ? "flex-col" : "flex-row"
        }`,
        containerClassName
      )}
    >
      <label
        className={cn(
          `flex ml-1 font-bold text-lg sm:text-xl  lg:w-[50%] ${
            vertical ? "self-start w-[50%]" : "self-start lg:w-[50%]"
          }`,
          labelClassName
        )}
      >
        {label}
      </label>
      <div className="w-full">
        <Textarea
          style={{
            borderRadius: 0,
            borderWidth: 0,
            height: "100px",
            ...style,
          }}
          {...props}
        />

        <p className="mt-1 ">
          <span className="text-bright-green">{note} </span> {noteText}
        </p>
      </div>
    </div>
  );
};

export default TextArea;
