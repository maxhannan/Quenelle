import { useEffect, useState } from "react";
import type { ChangeEvent, FC, ComponentPropsWithoutRef } from "react";
interface TextInputProps extends ComponentPropsWithoutRef<"input"> {
  error?: string;
  initValue?: string;

  changeHandler?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: FC<TextInputProps> = ({
  error,
  initValue,
  changeHandler,
  disabled = false,
  ...rest
}) => {
  const [value, setValue] = useState(initValue || "");

  useEffect(() => {
    if (initValue !== undefined) {
      setValue(initValue);
    } else {
      setValue("");
    }
  }, [initValue]);

  return (
    <div className="w-full flex flex-col justify-start gap-2">
      {/* hidden input allows form submission when primary input is disabled */}
      {disabled && <input type="hidden" name={rest.name} value={value} />}
      <input
        {...rest}
        className={`rounded-2xl font-light  bg-zinc-200 bg-opacity-40 dark:bg-zinc-800 dark:bg-opacity-40  focus:ring-neutral-500  border relative h-10 w-full p-2 pl-4 text-xl  appearance-none  focus:ring-2 focus:outline-none focus:border-none     placeholder-neutral-500   dark:placeholder-neutral-400   ${
          error
            ? "border-2 border-red-400 text-zinc-800 dark:text-zinc-50 "
            : disabled
            ? "border-2 border-indigo-500 text-indigo-500 "
            : " text-neutral-800 dark:text-neutral-50 border-neutral-300 dark:border-zinc-700"
        } `}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (changeHandler) {
            changeHandler(e);
          }
        }}
        disabled={disabled}
      />

      {error && (
        <div className="text-sm font-base tracking-wide text-red-400 w-full px-1">
          {error || ""}
        </div>
      )}
    </div>
  );
};

export default TextInput;
