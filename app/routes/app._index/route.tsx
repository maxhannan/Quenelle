import { SunIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { User2Icon } from "lucide-react";

import Spinner from "~/components/LoadingSpinner";
import RecipeCard from "~/components/display/RecipesCard";
import NewAppBar from "~/components/navigation/NewAppBar";

import { getUser } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  console.log("hello");
  const user = await getUser(request);
  return { user };
};

function HomeRoute() {
  const { user } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (navigation.state === "loading")
    return (
      <div className=" mx-auto h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  if (!user) return null;
  return (
    <div className=" container mx-auto  flex flex-col  mt-3  mb-28">
      <NewAppBar page="">
        <div className=" px-3 py-2 bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 rounded-full flex gap-2 items-center justify-between">
          <span className="font-bold">79°F</span>
          <SunIcon className="w-7 h-7 inline-block" />
        </div>
      </NewAppBar>
      <div className="text-[3rem] md:text-4xl   items-center  w-full    dark:text-neutral-200  font-bold text-neutral-600 rounded-2xl  ">
        <h1>Hi {user.firstName}!</h1>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="text-lg text-indigo-500 font-semibold ">
          Your prep list for today.
        </div>
        <RecipeCard
          to="/"
          subHeading="Created by Erik J."
          user={"ej"}
          name="PM Grill"
        />
        <div className="w-full  flex flex-col gap-2  text-xl font-light text-zinc-200 rounded-2xl">
          <div className="w-7/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600  p-3 rounded-xl">
            <span className="font-bold">79</span> Breakfast
          </div>
          <div className="w-5/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 p-3 rounded-xl">
            <span className="font-bold">52</span> Lunch
          </div>
          <div className="w-12/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 p-3 rounded-xl">
            <span className="font-bold">157</span> Dinner
          </div>
        </div>
        <div className="text-lg text-indigo-500 font-semibold ">
          Recipes changes.
        </div>
        <RecipeCard
          to="/"
          subHeading="Created by Erik J."
          user={"ej"}
          name="PM Grill"
        />
        <RecipeCard
          to="/"
          subHeading="Created by Erik J."
          user={"ej"}
          name="PM Grill"
        />
        <RecipeCard
          to="/"
          subHeading="Created by Erik J."
          user={"ej"}
          name="PM Grill"
        />
      </div>
    </div>
  );
}

export default HomeRoute;
