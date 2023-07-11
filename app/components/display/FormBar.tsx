import { forwardRef, type FC, Dispatch, SetStateAction } from "react";
import AppBar from "../navigation/AppBar";
import { Save, XCircle } from "lucide-react";
import { useNavigate } from "@remix-run/react";

type RefType = HTMLButtonElement;
type Props = {
  setVisible: Dispatch<SetStateAction<boolean>>;
  saveText: string;
};
const FormBar = forwardRef<RefType, Props>(function FormBarComponent(
  props,
  ref
) {
  const navigate = useNavigate();
  return (
    <div className="w-screen fixed top-0 left-0 right-0 px-3  dark:bg-zinc-900 bg-zinc-100 md:bg-transparent border-zinc-300 dark:border-zinc-800 z-50 md:relative md:w-auto pb-1 md:border-none md:p-0 shadow-sm dark:border-b md:shadow-none">
      <AppBar page="">
        <button
          ref={ref}
          type="submit"
          className=" font-light text-green-800  bg-green-300 rounded-xl  px-2 py-2 hover:bg-green-400 hover:text-green-900 transition-all duration-300 inline-flex gap-1 items-center "
        >
          <Save className="h-4 w-4" /> Save {props.saveText}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className=" font-light text-red-700  bg-red-300 rounded-xl  px-2 py-2 hover:bg-opacity-90 transition-all duration-300 inline-flex gap-1 items-center "
        >
          <XCircle className="h-4 w-4" />
          Cancel
        </button>
      </AppBar>
    </div>
  );
});

export default FormBar;
