import React from "react";
import { useUserContext } from "../app.dashboard/route";
import { type LoaderArgs } from "@remix-run/node";
import { getMembers } from "~/utils/teams.server";
import { useLoaderData } from "@remix-run/react";
import NewAppBar from "~/components/navigation/NewAppBar";

export async function loader({ request }: LoaderArgs) {
  const teams = await getMembers(request);
  return teams;
}

function DashBoardIndex() {
  const teams = useLoaderData<typeof loader>();
  console.log({ teams });
  const { user } = useUserContext();
  return <div className="lg:px-2">{user?.firstName}</div>;
}

export default DashBoardIndex;
