import React from "react";
import { useUserContext } from "../app.dashboard/route";
import { LoaderArgs } from "@remix-run/node";
import { getMembers } from "~/utils/teams.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const teams = await getMembers(request);
  return teams;
}

function DashBoardIndex() {
  const teams = useLoaderData<typeof loader>();
  console.log({ teams });
  const { user } = useUserContext();
  return <div>{user?.firstName}</div>;
}

export default DashBoardIndex;
