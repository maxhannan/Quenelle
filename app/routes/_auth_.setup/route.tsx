import {
  ArrowLongRightIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { Form } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { v4 } from "uuid";

import RestaurantAdder from "./components/RestaurantAdder";
import type { ActionArgs } from "@remix-run/node";
import LoadingButton from "~/components/buttons/LoadingButton";

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
  console.log({ restaurants });
  return restaurants;
}

function SetupRoute() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: v4(),
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  ]);

  const addRestauraunt = () => {
    setRestaurants([
      ...restaurants,
      {
        id: v4(),
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
      },
    ]);
  };
  return (
    <Form
      method="post"
      className="container max-w-4xl px-4 mx-auto flex flex-col gap-3 mt-10 mb-16 "
    >
      <h2 className="px-1 text-2xl sm:text-3xl dark:text-neutral-200 text-neutral-700 flex items-center justify-between">
        Setup your Restaurant(s){" "}
        <BuildingStorefrontIcon className="w-10 h-10" />
      </h2>
      {restaurants.map((restaurant) => (
        <RestaurantAdder
          key={restaurant.id}
          restaurant={restaurant}
          restaurants={restaurants}
          setRestaurants={setRestaurants}
        />
      ))}
      <div
        onClick={addRestauraunt}
        className="col-span-5   h-12 inline-flex border-r-none items-center dark:hover:text-zinc-700 justify-between px-3 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-700 border dark:border-zinc-700 border-zinc-300 border-dashed hover:text-zinc-200 hover:dark:bg-zinc-200  transition-all duration-300 rounded-xl text-lg text-zinc-700 dark:text-zinc-100  "
      >
        <h4 className="text-xl  ">Add Restaurant</h4>
        <PlusIcon className="h-7 w-7" />
      </div>
      <LoadingButton
        Icon={ArrowLongRightIcon}
        buttonName="submit"
        buttonText="Let's Get Started!"
      />
    </Form>
  );
}

export default SetupRoute;
