import React from "react";

import { getUser } from "~/utils/auth.server";
import { LoaderArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
type User = Awaited<ReturnType<typeof getUser>>;
export async function loader({ params, request }: LoaderArgs) {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  return user;
}

function PendingRoute() {
  const user = useLoaderData<User>();
  if (!user) return null;
  return (
    <div className="container mx-auto max-w-2xl h-screen flex  justify-center flex-col gap-2 sm:pl-3 px-2 ">
      <div className="flex flex-col gap-2 p-3 rounded-3xl ">
        <div className="flex items-center justify-between md:justify-normal gap-4">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
            Welcome {user.firstName}!
          </h1>
          <Spinner />
        </div>

        <h4 className="text-md  text-zinc-600 dark:text-zinc-400">
          A request has been sent to your team admin to approve your account.
        </h4>
        <h4 className="text-md text-zinc-600 dark:text-zinc-400">
          You will be notified when your account has been approved.
        </h4>
      </div>
    </div>
  );
}

export default PendingRoute;
