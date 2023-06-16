import React from "react";
import { useUserContext } from "../app.dashboard/route";
import { type LoaderArgs } from "@remix-run/node";
import { getMembers } from "~/utils/teams.server";
import { useLoaderData } from "@remix-run/react";
import NewAppBar from "~/components/navigation/NewAppBar";
import { Users, Users2Icon } from "lucide-react";
import RecipeCard from "~/components/display/ListCard";

export async function loader({ request }: LoaderArgs) {
  const teams = await getMembers(request);
  return teams;
}

function DashBoardIndex() {
  const teams = useLoaderData<typeof loader>();
  console.log({ teams });
  const { user } = useUserContext();
  return (
    <div className="">
      <NewAppBar page="Teams" />
      {teams.map((team) => (
        <div key={team.id} className="flex flex-col gap-2 w-full">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
              <Users2Icon className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{team.name}</div>
              <div className="text-sm text-gray-500">
                {team.city}, {team.state}
              </div>
            </div>
          </div>
          {team.members.map((member) => (
            <RecipeCard
              key={member.id}
              name={member.firstName + " " + member.lastName}
              subHeading={member.username}
              user={member.firstName[0] + member.lastName[0]}
              to="/"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default DashBoardIndex;
