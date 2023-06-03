import type { FC } from "react";
import { Restaurant } from "../route";
import { XCircleIcon } from "lucide-react";
import IconButton from "~/components/buttons/IconButton";
import TextInput from "~/components/formInputs/TextInput";

interface Props {
  restaurant: Restaurant;
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
}

const RestaurantAdder: FC<Props> = ({
  restaurant,
  restaurants,
  setRestaurants,
}) => {
  return (
    <>
      <div className="w-full flex gap-2">
        <TextInput
          name="restaurantName"
          placeholder="Restaurant Name"
          required
        />
        {restaurants.length > 1 && (
          <IconButton
            Icon={XCircleIcon}
            type="button"
            onClick={() =>
              setRestaurants(restaurants.filter((r) => r.id !== restaurant.id))
            }
          />
        )}
      </div>
      <TextInput name="address" placeholder="Address" required />
      <TextInput name="city" placeholder="City" required />
      <div className="w-full flex gap-2">
        <TextInput name="state" placeholder="State" required />
        <TextInput
          name="zip"
          placeholder="Zip"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{5}"
          required
        />
      </div>
      <div className="w-full rounded-full border border-zinc-500" />
    </>
  );
};

export default RestaurantAdder;
