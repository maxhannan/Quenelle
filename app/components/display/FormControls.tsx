import type { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import FormBar from "./FormBar";

interface Props {
  saveText: string;
  children?: React.ReactNode;
}

const FormControls: FC<Props> = ({ saveText, children }) => {
  return (
    <>
      <div className="md:hidden">
        <Sheet>
          <FormBar saveText={saveText} />

          <SheetContent side={"top"}>
            <SheetHeader>
              <SheetTitle>Are you sure absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
              {children}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block">
        <Sheet>
          <FormBar saveText={saveText} />

          <SheetContent side={"right"}>
            <SheetHeader>
              <SheetTitle>Are you sure absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
              {children}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default FormControls;
