import { LoaderArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { Dispatch, useState } from "react";
import { Progress } from "~/components/ui/progress";
import { getUser } from "~/utils/auth.server";
export async function loader({ params, request }: LoaderArgs) {
  if (!params.id) return redirect("/login");
  const user = await getUser(request);

  return user;
}
type ContextType = {
  setProgress: Dispatch<React.SetStateAction<number>>;
};
function SetUpRoute() {
  const user = useLoaderData();
  const [progress, setProgress] = useState(33);
  return (
    <div className=" max-h-screen  h-screen flex flex-col items-center xl:mt-0 justify-center gap-3 px-3 ">
      <div className=" flex-col gap-2 flex w-full transition-all container mx-auto max-w-2xl ">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
          Welcome {user.firstName}!
        </h1>
        <Progress value={progress} />
        <Outlet context={{ setProgress }} />
      </div>
    </div>
  );
}

export const useSetProgress = () => {
  return useOutletContext<ContextType>();
};

export default SetUpRoute;
