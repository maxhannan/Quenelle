import { Transition } from "@headlessui/react";

import TextareaAutosize from "react-textarea-autosize";

import { FetcherWithComponents, Form, useFetcher } from "@remix-run/react";

import {
  XIcon,
  XCircleIcon,
  PlusCircleIcon,
  Send,
  StickyNoteIcon,
} from "lucide-react";
import {
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
  FormEventHandler,
  useRef,
} from "react";
import { v4 } from "uuid";
import SlideDownTransition from "~/components/animations/SlideDown";
import SlideUpTransition from "~/components/animations/SlideUp";
import CustomModal from "~/components/display/CustomModal";
import { Checkbox } from "~/components/ui/checkbox";
import Spinner from "~/components/LoadingSpinner";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}
type Colors = "yellow" | "orange" | "pink" | "indigo" | "green";
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};
const StickyNote: FC<Props> = ({
  showModal,
  setShowModal,
  loading,
  setLoading,
}) => {
  const [activeColor, setActiveColor] = useState<Colors>("yellow");
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  const addTodo = () => {
    const newTodo = {
      id: v4(),
      text: "",
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };
  const updateTodo = (id: string, text: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    );
    setTodos(newTodos);
  };
  const colorVariants = {
    yellow: "bg-yellow-300 ",
    orange: "bg-orange-300 ",
    pink: "bg-pink-300 ",
    indigo: "bg-indigo-300 ",
    green: "bg-green-300 ",
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (formRef.current) {
      setLoading(true);
      setTodos([]);
      const formData = new FormData(formRef.current);
      formData.set("color", activeColor);
      formData.set("todos", JSON.stringify(todos));
      fetcher.submit(formData, { method: "POST" });
    }
  };
  return (
    <CustomModal isOpen={showModal} setIsOpen={setShowModal}>
      <fetcher.Form onSubmit={handleSubmit} ref={formRef} method="post">
        {loading ? (
          <div
            className={`flex flex-col gap-2 w-full h-48 items-center justify-center rounded-xl p-2 transition-all duration-300 ${colorVariants[activeColor]}  `}
          >
            {" "}
            <Spinner size={14} />
          </div>
        ) : (
          <div
            className={`flex flex-col gap-2 w-full  rounded-xl p-2 transition-all duration-300 ${colorVariants[activeColor]}  `}
          >
            <div className="flex flex-row justify-end gap-2 items-center">
              <button
                type="button"
                onClick={() => setActiveColor("orange")}
                className={`${
                  activeColor === "orange" ? "border-2 border-zinc-500 " : " "
                } h-7 w-7 rounded-full bg-orange-500 text-zinc-100 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setActiveColor("pink")}
                className={`${
                  activeColor === "pink" ? "border-2 border-zinc-500 " : " "
                } h-7 w-7 rounded-full bg-pink-500 text-zinc-100 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setActiveColor("indigo")}
                className={`${
                  activeColor === "indigo" ? "border-2 border-zinc-500 " : " "
                } h-7 w-7 rounded-full bg-indigo-500 text-zinc-100 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setActiveColor("green")}
                className={`${
                  activeColor === "green" ? "border-2 border-zinc-500 " : " "
                } h-7 w-7 rounded-full bg-green-500 text-zinc-100 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setActiveColor("yellow")}
                className={`${
                  activeColor === "yellow" ? "border-2 border-zinc-500 " : " "
                } h-7 w-7 rounded-full bg-yellow-500 text-zinc-100 transition-all duration-300`}
              />
              <button onClick={() => setShowModal(false)} type="button">
                <XIcon className="h-7 w-7" />
              </button>
            </div>
            <div className="flex min-h-12">
              <TextareaAutosize
                autoFocus
                required
                minRows={1}
                name="note"
                placeholder="Leave a note..."
                className=" scrollbar-none resize-none rounded-2xl  focus:ring-indigo-500  bg-transparent  focus:border-indigo-500 focus:outline-none  transition-all duration-300 focus:ring-2 font-light    w-full p-2  text-xl text-zinc-800     placeholder-zinc-600   dark:placeholder-neutral-400 dark:text-neutral-50    "
              />
            </div>

            <div className="flex flex-col gap-2 ">
              {todos.map((todo) => (
                <SlideUpTransition key={todo.id}>
                  <div className="flex p-2 gap-2 items-center">
                    <Checkbox className="w-5 h-5 border-zinc-500 rounded-lg text-xl" />
                    <input
                      required
                      value={todo.text}
                      onChange={(e) => updateTodo(todo.id, e.target.value)}
                      placeholder="Type Something..."
                      className="w-full bg-transparent  focus:ring-0 focus:outline-none focus:border-b focus:border-indigo-500 text-base placeholder:text-zinc-600 rounded-none"
                    />
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className=" text-zinc-700 hover:text-red-500 transition-all duration-150"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </SlideUpTransition>
              ))}

              <button
                onClick={addTodo}
                type="button"
                className="flex flex-row justify-center items-center gap-2  bg-transparent rounded-lg p-1 px-2 text-base text-zinc-800 font-light hover:bg-opacity-90 transition-all duration-300 bg-zinc-100 bg-opacity-30 "
              >
                Add a Checklist Item
                <PlusCircleIcon className="h-4 w-4" />
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex flex-row justify-center items-center gap-2 bg-zinc-100 bg-opacity-30 rounded-2xl p-2 text-xl text-zinc-800 font-light hover:bg-opacity-90 transition-all duration-300"
              >
                Post
                <StickyNoteIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </fetcher.Form>
    </CustomModal>
  );
};

export default StickyNote;
