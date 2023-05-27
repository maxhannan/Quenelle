/* eslint-disable react-hooks/exhaustive-deps */
import { Transition, Dialog } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { Fragment, useEffect, useState } from "react";
import { IMAGE_URL } from "~/utils/images";

import type { FC } from "react";
import Spinner from "../LoadingSpinner";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  imgSrcs: string[];
}

const Carousel: FC<Props> = ({ isOpen, setIsOpen, imgSrcs }) => {
  const [loaded, setLoaded] = useState(false);
  const [loadList, setLoadList] = useState<boolean[]>([]);

  useEffect(() => {
    if (imgSrcs.length === loadList.length) {
      setLoaded(true);
    }
  }, [loadList]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-xl bg-transparent">
              {!loaded && (
                <div className="w-full flex justify-center items-center">
                  <Spinner size={14} />
                </div>
              )}
              <div
                className={`carousel w-full h-auto max-h-[70vh] ${
                  !loaded && "hidden"
                }`}
              >
                {imgSrcs.map((img, i) => (
                  <div
                    key={i}
                    id={`item${i}`}
                    className="carousel-item w-full h-auto rounded-xl  overflow-hidden "
                  >
                    <img
                      src={[IMAGE_URL, img, "carousel"].join("/")}
                      className=" object-contain w-full h-auto"
                      onLoad={(e) => setLoadList((prev) => [...prev, true])}
                      alt="Tailwind CSS Carousel component"
                    />
                  </div>
                ))}
              </div>
              {loaded && (
                <div className="flex justify-center w-full py-2 gap-2  ">
                  {imgSrcs.length > 1 &&
                    imgSrcs.map((img, i) => (
                      <Link
                        key={i}
                        to={`#item${i}`}
                        replace
                        className="btn btn-sm bg-neutral-800 border border-neutral-700 rounded-xl active:bg-red-500 hover:bg-red-500"
                      >
                        {i + 1}
                      </Link>
                    ))}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Carousel;
