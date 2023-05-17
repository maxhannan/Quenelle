import type { Ingredient } from "@prisma/client";

import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";

const IngredientTable = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const navigate = useNavigate();
  return (
    <div className=" border border-neutral-300 dark:border-neutral-700 rounded-xl font-light   text-lg text-neutral-700 dark:text-neutral-100 ">
      <table className="w-full mx-auto overflow-hidden table-fixed rounded-xl ">
        <thead className="dark:bg-neutral-800 bg-neutral-200 border-b border-neutral-300 dark:border-neutral-700 ">
          <tr className="text-left ">
            <th className="px-6 py-4 text-lg font-semibold w-7/12 ">
              {" "}
              Ingredient{" "}
            </th>
            <th className="px-3 py-4 text-lg font-semibold "> Qty </th>
          </tr>
        </thead>
        <tbody className="">
          {ingredients.length > 0 &&
            ingredients.map((i) => (
              <tr className="max-w-xs break-words " key={i.id}>
                <td
                  style={{ maxWidth: "100px" }}
                  className="px-6 py-4 break-all"
                >
                  {i.linkId ? (
                    <p
                      onClick={() => navigate(`/app/recipes/${i.linkId}`)}
                      className="break-normal text-violet-500  hover:text-violet-700 cursor-pointer flex items-center gap-2"
                    >
                      {i.ingredient} <ArrowLongRightIcon className="w-6 h-6" />
                    </p>
                  ) : (
                    <p className="break-normal">{i.ingredient}</p>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex  ">
                    <p>
                      {i.qty && Number(i.qty) + "  "}
                      <b>{i.unit}</b>
                    </p>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientTable;
