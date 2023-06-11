import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import LoadingButton from "~/components/buttons/LoadingButton";

import { createTeam, getUser } from "~/utils/auth.server";
import TextInput from "~/components/formInputs/TextInput";
import IconButton from "~/components/buttons/IconButton";

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  if (user.approved) return redirect("/app/recipes");
  return user;
}

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);
  const data = await request.formData();
  const name = data.get("teamName") as string;
  const city = data.get("city") as string;
  const state = data.get("state") as string;

  let error = null;
  if (!user || !name || !city || !state) {
    error = "Team Creation Failed, Please Try Again";
  }
  let team;
  if (user && name && city && state) {
    team = await createTeam(user.id, { name, city, state });
  }

  return { team, error };
}

function SetupRoute() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const data = useActionData<typeof action>();
  useEffect(() => {
    if (data && data.team) {
      navigate(`/setup/team/${data.team.id}`);
    }
    if (data && data.error) {
      setError(data.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg text-zinc-800 dark:text-zinc-200 pl-2 ">
          Have a code to join a team?
        </h3>
        <div className="flex gap-2">
          <TextInput name="teamCode" placeholder="Enter it here..." />
          <div className="flex-none">
            <IconButton Icon={ArrowRightIcon} />
          </div>
        </div>
      </div>
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-zinc-700"></div>
        <span className="flex-shrink mx-4 text-zinc-600  dark:text-zinc-400">
          Or
        </span>
        <div className="flex-grow border-t border-zinc-700"></div>
      </div>
      <div className="w-full   text-zinc-800 dark:text-zinc-200 flex flex-col gap-3 ">
        <div className="flex gap-4 items-center pl-2">
          <h4 className="text-3xl  ">Set Up Your Team</h4>
          <BuildingStorefrontIcon className="w-7 h-7" />
        </div>
        <Form method="post">
          {error && <h1 className="text-red-500">Form Error</h1>}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <TextInput name="teamName" placeholder="Team Name" />
            </div>
            <div className="col-span-6">
              <TextInput name="city" placeholder="City" />
            </div>
            <div className="col-span-6 ">
              <TextInput name="state" placeholder="State" />
            </div>

            <div className="col-span-12">
              <LoadingButton
                Icon={ArrowRightIcon}
                loading={
                  navigation.state === "loading" ||
                  navigation.state === "submitting"
                }
                loadingText="Creating Team..."
                action={() => {
                  console.log("hello");
                  navigate("/setup/team/fdshaJLkh");
                }}
                type="submit"
                buttonName="SignUp"
                buttonText="Let's get started!"
                placeholder="Team Name"
              />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default SetupRoute;
