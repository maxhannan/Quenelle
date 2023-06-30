import { useState } from "react";
import { useDish } from "../app.menus.dishes.$id/route";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import AppBar from "~/components/navigation/AppBar";
import IconButton from "~/components/buttons/IconButton";
import {
  ArrowLongRightIcon,
  ArrowUturnLeftIcon,
  PencilIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import Carousel from "~/components/display/Carousel";
import Spinner from "~/components/LoadingSpinner";
import Chip from "~/components/display/Chip";
import ListCard from "~/components/display/ListCard";
import SlideUpTransition from "~/components/animations/SlideUp";
import RecipeCard from "~/components/display/RecipesCard";
import { colorVariants } from "~/utils/staticLists";

function DishIndex() {
  const dish = useDish();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();
  if (
    navigation.state === "loading" &&
    navigation.location.pathname !== location.pathname
  ) {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }

  if (!dish) {
    return navigate("/app/menus/dishes");
  }
  return (
    <main className="mb-28 container mx-auto xl:pl-2">
      <AppBar page="">
        <IconButton
          Icon={PencilIcon}
          name="Edit Recipe"
          onClick={() => navigate("edit", { replace: true })}
        />
        {dish.images.length > 0 && (
          <IconButton
            Icon={PhotoIcon}
            name="Open Gallery"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        <IconButton
          Icon={ScaleIcon}
          name="Scale dish"
          onClick={() => console.log("edit")}
        />
        <IconButton
          Icon={ArrowUturnLeftIcon}
          name="Go Back"
          onClick={() => navigate(-1)}
        />
      </AppBar>
      {dish.images.length > 0 && (
        <Carousel isOpen={isOpen} setIsOpen={setIsOpen} imgSrcs={dish.images} />
      )}
      <SlideUpTransition>
        <div className="text-3xl   w-full items-center flex justify-between mb-4  dark:text-zinc-200  font-bold text-zinc-600 rounded-xl ">
          <div>{dish.name}</div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex  gap-2 flex-wrap rounded-xl bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700 p-2  ">
              {dish.allergens &&
                dish.allergens.length > 0 &&
                dish.allergens.map((a) => <Chip key={a} content={a} />)}
            </div>
            <div className="text-2xl lg:text-3xl border  border-zinc-300 dark:border-zinc-700 gap-2 bg-zinc-200 dark:bg-zinc-800 px-4 w-full items-center flex justify-between dark:text-zinc-200 p-2  text-zinc-600 rounded-xl font-light ">
              <div>Components</div>
            </div>
            {dish.ingredients.map((i) => {
              if (i.linkId && i.linkRecipe) {
                return (
                  <RecipeCard
                    subHeading={i.qty + " " + i.unit}
                    name={i.linkRecipe.name}
                    colorVariant={i.linkRecipe.author.colorVariant}
                    user={
                      i.linkRecipe.author!.firstName[0].toLowerCase() +
                      i.linkRecipe.author!.lastName[0].toLowerCase()
                    }
                    to={`/app/recipes/${i.linkId}`}
                    key={i.id}
                  />
                );
              } else
                return (
                  <div
                    key={i.id}
                    className="  w-full max-h-full border-zinc-200 border bg-opacity-30 dark:bg-opacity-30 bg-zinc-200 dark:bg-zinc-800   rounded-xl  pl-2 pr-2 font-light py-3  flex justify-start items-center  px-2  dark:border-zinc-800"
                  >
                    <div
                      className={`${colorVariants[6]}  text-zinc-700 dark:text-zinc-700 
         trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200  child flex-shrink-0 items-center mr-4 justify-center w-14 h-14 overflow-hidden group-hover:border-indigo-500 border-zinc-500 rounded-full   dark:border-zinc-700`}
                    >
                      <span className=" text-2xl lg:text-2xl ">
                        <PuzzlePieceIcon className="w-6 h-6 text-zinc-800" />
                      </span>
                    </div>
                    <div className=" ">
                      <h5 className="text-xl lg:text-2xl text-zinc-700 dark:text-zinc-100">
                        {i.ingredient}
                      </h5>
                      {(i.qty || i.unit) && (
                        <h6 className="text-md lg:text-lg mt-1  text-indigo-500 dark:text-indigo-300">
                          {i.qty && i.qty} {i.unit && i.unit}
                        </h6>
                      )}
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {dish.steps.length > 0 &&
              dish.steps.map((s, i) => (
                <div
                  key={i}
                  className=" border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800  bg-opacity-50 dark:bg-opacity-50 transition-all duration-300 rounded-xl p-4 text-lg text-zinc-700 dark:text-zinc-100"
                >
                  <h5 className="text-2xl mb-2">Step {i + 1}</h5>
                  <p className="text-lg font-light ">{s}</p>
                </div>
              ))}
            {dish.menu && dish.menu.length > 0 && (
              <div className="text-xl bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200  p-4  text-zinc-700 rounded-xl font-light  ">
                Menus
                <div className="flex gap-3 flex-wrap r mt-2">
                  {dish.menu.map((m) => (
                    <div key={m.id}>
                      <Link to={`/app/menus/${m.id}`}>
                        <div className=" flex items-center gap-2  bg-indigo-500 hover:bg-indigo-600 p-2 px-4  font-light rounded-xl text-base text-zinc-100 dark:text-zinc-100 ">
                          {m.name} <ArrowLongRightIcon className="w-5 h-5" />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="text-2xl bg-zinc-200 dark:bg-zinc-800  dark:text-zinc-200 p-4  text-zinc-700 rounded-xl font-light  ">
              <div>
                <b>Author: </b>
                {dish.author?.firstName + " " + dish.author?.lastName}
              </div>
              <div className="flex gap-2 flex-wrap  mt-2 text-lg ">
                <div>
                  <b>Added: </b>
                  {new Date(dish.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <b>Updated: </b>
                  {new Date(dish.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlideUpTransition>
    </main>
  );
}

export default DishIndex;
