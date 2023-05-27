import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

interface Props {
  name: string;
  children: React.ReactNode;
}

const Accordion = ({ name, children }: Props) => {
  return (
    <div className="rounded-2xl border   border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-1.5">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <div className="flex items-center gap-4">
              <Disclosure.Button className="dark:bg-opacity-50 transition-all duration-300 flex w-full items-center justify-between  rounded-xl  bg-zinc-200 font-normal dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-3 text-left text-xl lg:text-2xl  text-zinc-700 dark:text-zinc-200  focus:outline-none focus-visible:ring focus-visible:ring-violet-500 focus-visible:ring-opacity-75">
                <span>{name}</span>
                <ChevronUpIcon
                  className={`${open ? "rotate-180 transform" : ""} h-7 w-7 `}
                />
              </Disclosure.Button>
            </div>
            <Transition
              enter="transition-all ease-linear  duration-300  overflow-hidden"
              enterFrom="transform opacity-0 "
              enterTo="transform opacity-100  "
              leave="transition-all ease-linear duration-200 overflow-hidden"
              leaveFrom="transform opacity-100 "
              leaveTo="transform opacity-0  "
            >
              <Disclosure.Panel className=" flex flex-col gap-1 text-sm text-gray-500 mt-1.5 px-1 pb-1">
                {children}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Accordion;
