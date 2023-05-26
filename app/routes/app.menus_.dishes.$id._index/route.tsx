import { useState } from "react";
import { useDish } from "../app.menus_.dishes.$id/route";
import { Link, useNavigate, useNavigation } from "@remix-run/react";
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

function DishIndex() {
  const dish = useDish();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  if (navigation.state === "loading") {
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
    <main className="mb-28">
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

      <div className="text-3xl text-zinc-700   w-full items-center flex justify-between mb-2 pl-1 dark:text-neutral-200   rounded-xl ">
        <div>{dish.name}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex  gap-2 flex-wrap rounded-xl bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 p-2  ">
            {dish.allergens &&
              dish.allergens.length > 0 &&
              dish.allergens.map((a) => <Chip key={a} content={a} />)}
          </div>
          <div className="text-2xl lg:text-3xl border  border-neutral-300 dark:border-neutral-700 gap-2 bg-neutral-200 dark:bg-neutral-800 px-4 w-full items-center flex justify-between dark:text-neutral-200 p-4  text-neutral-600 rounded-xl font-light ">
            <div>Components</div>
          </div>
          {dish.ingredients.map((i) => {
            if (i.linkId && i.linkRecipe) {
              return (
                <ListCard
                  subHeading={i.qty + " " + i.unit}
                  name={i.linkRecipe.name}
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
                  className="  w-full max-h-full border-neutral-300 border bg-opacity-50 dark:bg-opacity-50 bg-neutral-200 dark:bg-neutral-800   rounded-xl  pl-4 pr-2 font-light py-4   flex justify-start items-center  px-4   dark:border-neutral-700"
                >
                  <div className=" ">
                    <h5 className="text-xl lg:text-2xl text-neutral-700 dark:text-neutral-100">
                      {i.ingredient}
                    </h5>
                    {(i.qty || i.unit) && (
                      <h6 className="text-md lg:text-lg mt-1  text-violet-500 dark:text-violet-300">
                        {i.qty && i.qty} {i.unit && i.unit}
                      </h6>
                    )}
                  </div>
                  <div className=" ml-auto ">
                    <PuzzlePieceIcon className="text-neutral-800 dark:text-neutral-200 w-5 h-5" />
                  </div>
                </div>
              );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {dish.steps.length &&
            dish.steps.map((s, i) => (
              <div
                key={i}
                className=" border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800  bg-opacity-50 dark:bg-opacity-50 transition-all duration-300 rounded-xl p-4 text-lg text-neutral-700 dark:text-neutral-100"
              >
                <h5 className="text-2xl mb-2">Step {i + 1}</h5>
                <p className="text-lg font-light ">{s}</p>
              </div>
            ))}
          {dish.menu && dish.menu.length > 0 && (
            <div className="text-xl bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200  p-4  text-neutral-700 rounded-xl font-light  ">
              Menus
              <div className="flex gap-3 flex-wrap r mt-2">
                {dish.menu.map((m) => (
                  <div key={m.id}>
                    <Link to={`/app/menus/${m.id}`}>
                      <div className=" flex items-center gap-2  bg-violet-500 hover:bg-violet-600 p-2 px-4  font-light rounded-xl text-base text-neutral-100 dark:text-neutral-100 ">
                        {m.name} <ArrowLongRightIcon className="w-5 h-5" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="text-2xl bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 p-4  text-neutral-700 rounded-xl font-light  ">
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
    </main>
  );
}

export default DishIndex;
