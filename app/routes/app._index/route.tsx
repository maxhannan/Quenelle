import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";

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
    <div className=" container mx-auto max-w-3xl flex  gap-2 mt-12 items-center">
      <div className="text-4xl md:text-4xl  gap-2 items-start  w-full flex justify-between mb-3  p-3  dark:text-neutral-200  font-bold text-neutral-600 rounded-xl ">
        <div>
          <h1>Hi {user.firstName}!</h1>
          <h2 className="text-base text-zinc-600">Welcome to your kitchen.</h2>
        </div>
        <div
          className={`bg-indigo-500  text-zinc-800 dark:text-zinc-300 trasition-all duration-300 inline-flex h-16 w-16 group-hover:bg-indigo-500  group-hover:text-zinc-200  child flex-shrink-0 items-center mr-4 justify-center  overflow-hidden   rounded-2xl   `}
        >
          <span className=" text-4xl  ">
            {user.firstName[0].toLowerCase() + user.lastName[0].toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomeRoute;
