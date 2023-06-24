import React from "react";
import { useUserContext } from "../app.dashboard/route";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { getMembers } from "~/utils/teams.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import NewAppBar from "~/components/navigation/NewAppBar";

import ApprovedCard from "./components/ApprovedCard";
import PendingCard from "./components/PendingCard";
import { prisma } from "~/utils/prisma.server";
import { type Role } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  const teams = await getMembers(request);
  return teams;
}

export async function action({ request }: ActionArgs) {
  const data = await request.formData();
  const id = data.get("id");
  const action = data.get("action");
  console.log({ id, action });

  switch (action) {
    case "approve":
      await prisma.user.update({
        where: {
          id: id as string,
        },
        data: {
          approved: true,
        },
      });
      break;
    case "role":
      await prisma.user.update({
        where: {
          id: id as string,
        },
        data: {
          role: data.get("role") as Role,
        },
      });
      break;
    case "delete":
      await prisma.user.update({
        where: {
          id: id as string,
        },
        data: {
          approved: false,
          teams: {
            disconnect: {
              id: data.get("teamId") as string,
            },
          },
        },
      });
    default:
      break;
  }
  return null;
}

function DashBoardIndex() {
  const teams = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  console.log({ teams });
  const { user } = useUserContext();
  if (!user) return null;
  console.log({ user });
  return (
    <div className="container max-w-4xl mx-auto">
      <NewAppBar page="Teams" />
      <div className="  rounded-2xl">
        {teams.map((team) => (
          <div key={team.id} className="flex flex-col gap-2 ">
            <div className="flex  justify-between w-full items-center">
              <div>
                <div className="text-xl font-semibold dark:text-zinc-100">
                  {team.name}
                </div>
                <div className="text-base text-zinc-500">
                  {team.city}, {team.state}
                </div>
              </div>
              <div className="">
                <button className="bg-indigo-500 rounded-lg text-sm px-2 py-2 text-zinc-100 hover:bg-indigo-400">
                  {" "}
                  Invite Members{" "}
                </button>
              </div>
            </div>
            <div className="  flex flex-col border-zinc-300 dark:border-zinc-700 border rounded-2xl [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-zinc-300 [&>*:not(:last-child)]:dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 bg-opacity-60">
              {team.members
                .filter((m) => m.id !== user.id)
                .map((m) =>
                  m.approved ? (
                    <ApprovedCard key={m.id} m={m} teamId={team.id} />
                  ) : (
                    <PendingCard key={m.id} m={m} fetcher={fetcher} />
                  )
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashBoardIndex;
