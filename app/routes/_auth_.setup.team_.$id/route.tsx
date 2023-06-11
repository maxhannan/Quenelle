import React from "react";
import SlideUpTransition from "~/components/animations/SlideUp";
import { useSetProgress } from "../_auth_.setup/route";
import LoadingButton from "~/components/buttons/LoadingButton";
import { ArrowRightIcon } from "lucide-react";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { type ActionArgs, type LoaderArgs, redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { approveTeamMember, getUser } from "~/utils/auth.server";

export async function loader({ params }: LoaderArgs) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
  });
  return team;
}

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  await approveTeamMember(user.id);
  return redirect("/app/recipes");
}

function TeamSetupRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { setProgress } = useSetProgress();
  const team = useLoaderData<typeof loader>();
  if (!team) navigate("/login");
  if (!team) return null;
  setProgress(66);
  return (
    <SlideUpTransition>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl text-zinc-800 dark:text-zinc-200  ">
          Your Team Code
        </h3>
        <div className="bg-zinc-200 dark:bg-zinc-800  dark:bg-opacity-30  p-2 rounded-full flex justify-center">
          <h4 className="text-lg text-zinc-800 dark:text-zinc-200">
            {team.id}
          </h4>
        </div>
        <h4 className="text-lg text-zinc-600 dark:text-zinc-400">
          Don't worry, you can always access this later
        </h4>
        <Form method="post">
          <LoadingButton
            Icon={ArrowRightIcon}
            type="submit"
            loading={
              navigation.state === "loading" ||
              navigation.state === "submitting"
            }
            loadingText="Creating Team..."
            buttonName="SignUp"
            buttonText="Let's get started!"
            placeholder="Team Name"
          />
        </Form>
      </div>
    </SlideUpTransition>
  );
}

export default TeamSetupRoute;
