import { Transition } from "@headlessui/react";
import type { ReactNode } from "react";

const FadeIn = ({ children }: { children: ReactNode }) => {
  return (
    <Transition
      enter="transition-all transform  ease-in-out  duration-500"
      enterFrom=" opacity-0 "
      enterTo=" opacity-100 "
      leave="transition ease-in duration-400"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      appear
      show
    >
      {children}
    </Transition>
  );
};

export default FadeIn;
