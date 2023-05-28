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
      <div className="text-4xl md:text-4xl flex-col gap-2 items-start  w-full flex justify-between mb-3   dark:text-neutral-200  font-bold text-neutral-600 rounded-xl ">
        <h1>Hi {user.firstName}!</h1>
      </div>
    </div>
  );
}

export default HomeRoute;
