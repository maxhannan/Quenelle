import { CalendarDaysIcon, SunIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Calendar } from "lucide-react";
import Spinner from "~/components/LoadingSpinner";
import ListCard from "~/components/display/ListCard";

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
    <div className=" container mx-auto max-w-3xl flex flex-col  gap-2 mt-3  items-center mb-28">
      <div className="text-4xl md:text-4xl  gap-2 items-center  w-full flex justify-between mb-2   dark:text-neutral-200  font-bold text-neutral-600 rounded-xl ">
        <div>
          <h1>Hi {user.firstName}!</h1>
          <h2 className="text-base text-zinc-600">Welcome to your kitchen.</h2>
        </div>
        <div
          className={`bg-indigo-500  text-zinc-800 dark:text-zinc-300 trasition-all duration-300 inline-flex h-14 w-14 group-hover:bg-indigo-500  group-hover:text-zinc-200  child flex-shrink-0 items-center  justify-center  overflow-hidden   rounded-2xl   `}
        >
          <span className=" text-3xl  ">
            {user.firstName[0].toLowerCase() + user.lastName[0].toLowerCase()}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full  flex  gap-2  text-xl font-light justify-between text-zinc-200 rounded-2xl ">
          <div className="  rounded-xl flex gap-2 items-center justify-between">
            <span className="font-bold">{new Date().toDateString()}</span>
            <CalendarDaysIcon className="w-5 h-5 inline-block" />
          </div>
          <div className=" p-3 bg-indigo-500 rounded-xl flex gap-2 items-center justify-between">
            <span className="font-bold">79°F</span>
            <SunIcon className="w-7 h-7 inline-block" />
          </div>
        </div>
        <div className="text-lg text-indigo-500 font-semibold ">
          Your prep list for today.
        </div>
        <ListCard
          to="/"
          active
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
        <ListCard
          to="/"
          active
          subHeading="Created by Erik J."
          user={"ej"}
          name="PM Grill"
        />
        <ListCard
          to="/"
          active
          subHeading="Created by Erik J."
          user={"ej"}
          name="PM Grill"
        />
        <ListCard
          to="/"
          active
          subHeading="Created by Erik J."
          user={"ej"}
          name="PM Grill"
        />
      </div>
    </div>
  );
}

export default HomeRoute;
