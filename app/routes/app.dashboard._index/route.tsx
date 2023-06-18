import React from "react";
import { useUserContext } from "../app.dashboard/route";
import { type LoaderArgs } from "@remix-run/node";
import { getMembers } from "~/utils/teams.server";
import { useLoaderData } from "@remix-run/react";
import NewAppBar from "~/components/navigation/NewAppBar";
import { Users, Users2Icon } from "lucide-react";
import RecipeCard from "~/components/display/ListCard";
import ComboBox from "~/components/formInputs/ComboBox";

export async function loader({ request }: LoaderArgs) {
  const teams = await getMembers(request);
  return teams;
}

const colorVariants = [
  "bg-yellow-300 ",
  "bg-orange-300 ",
  "bg-pink-300 ",
  "bg-indigo-300 ",
  "bg-green-300 ",
  "bg-amber-300 ",
  "bg-lime-300 ",
  "bg-teal-300 ",
  "bg-cyan-300 ",
  "bg-sky-300",
  "bg-emerald-300 ",
  "bg-blue-300 ",
  "bg-purple-300 ",
  "bg-violet-300 ",
  "bg-rose-300 ",
  "bg-red-300 ",
];
function DashBoardIndex() {
  const teams = useLoaderData<typeof loader>();
  console.log({ teams });
  const { user } = useUserContext();
  return (
    <div className="">
      <NewAppBar page="Teams" />
      <div className="lg:p-2  rounded-2xl">
        {teams.map((team) => (
          <div
            key={team.id}
            className="grid grid-cols-1 gap-4 w-full lg:grid-cols-5"
          >
            <div className="flex  space-x-4 col-span-2">
              <div className="flex flex-col justify-center">
                <div className="text-2xl font-semibold dark:text-zinc-100">
                  {team.name}
                </div>
                <div className="text-lg text-zinc-500">
                  {team.city}, {team.state}
                </div>
                <div className="mt-2">
                  <button className="bg-indigo-500 rounded-lg text-lg px-3 py-1 text-zinc-100 hover:bg-indigo-400">
                    {" "}
                    Invite Members{" "}
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-3  flex flex-col border-zinc-700 border rounded-2xl [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-zinc-700 bg-zinc-800 bg-opacity-60">
              {team.members.map((member) => (
                <div key={member.id} className="flex ">
                  <div className="w-full p-2 flex gap-2 items-center border-zinc-700 ">
                    <div
                      className={` trasition-all duration-300 inline-flex group-hover:bg-indigo-500  ${
                        colorVariants[
                          Math.floor(Math.random() * (colorVariants.length - 1))
                        ]
                      } group-hover:text-zinc-200  child flex-shrink-0 items-center  justify-center w-10 h-10 md:h-14 md:w-14 overflow-hidden group-hover:border-indigo-500 border-zinc-500 rounded-xl lg:rounded-2xl  border dark:border-zinc-700`}
                    >
                      <span className=" text-base lg:text-2xl ">mh</span>
                    </div>
                    <div className="   space-x-4 col-span-2">
                      <div className="flex flex-col justify-center">
                        <div className="text-base lg:text-lg font-semibold dark:text-zinc-100 flex items-center">
                          {member.firstName} {member.lastName}
                          {member.approved ? (
                            <span className="bg-green-500 text-zinc-100 text-xs  p-[2px] px-2  rounded-full ml-2 ">
                              Approved
                            </span>
                          ) : (
                            <span className="bg-red-500 text-zinc-100 text-xs p-[2px] px-2  rounded-full ml-2 ">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="text-sm lg:text-base text-zinc-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end items-center p-2">
                    <div className="flex-col flex md:flex-row gap-2">
                      {!member.approved && (
                        <>
                          <button className="border border-green-500 rounded-lg text-sm md:text-base px-2 py-1 text-zinc-100 hover:bg-green-400">
                            {" "}
                            Approve{" "}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashBoardIndex;
