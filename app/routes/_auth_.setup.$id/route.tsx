import {
  ArrowLongRightIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { v4 } from "uuid";

import RestaurantAdder from "./components/RestaurantAdder";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import LoadingButton from "~/components/buttons/LoadingButton";
import { Progress } from "~/components/ui/progress";
import { getUser } from "~/utils/auth.server";
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

export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const restaurants = data.getAll("restaurants");

  return restaurants;
}
type User = Awaited<ReturnType<typeof getUser>>;
function SetupRoute() {
  const navigate = useNavigate();
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
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <TextInput name="teamName" placeholder="Team Name" />
          </div>
          <div className="col-span-6">
            <TextInput name="city" placeholder="City" />
          </div>
          <div className="col-span-6 ">
            <TextInput name="State" placeholder="State" />
          </div>

          <div className="col-span-12">
            <LoadingButton
              Icon={ArrowRightIcon}
              action={() => {
                console.log("hello");
                navigate("/setup/team/fdshaJLkh");
              }}
              buttonName="SignUp"
              buttonText="Let's get started!"
              placeholder="Team Name"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SetupRoute;
