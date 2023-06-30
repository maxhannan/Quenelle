import React, { FormEvent, useRef, useState } from "react";
import { useUserContext } from "../app.dashboard/route";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { getMembers } from "~/utils/teams.server";
import { useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import NewAppBar from "~/components/navigation/NewAppBar";

import ApprovedCard from "./components/ApprovedCard";
import PendingCard from "./components/PendingCard";
import { prisma } from "~/utils/prisma.server";
import { type Role } from "@prisma/client";
import CustomModal from "~/components/display/CustomModal";
import LoadingButton from "~/components/buttons/LoadingButton";
import { UserPlus2Icon } from "lucide-react";
import TextInput from "~/components/formInputs/TextInput";
import { InviteUser } from "~/utils/email.server";

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
    case "invite":
      await InviteUser(data);
      break;
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
  const formRef = useRef<HTMLFormElement>(null);
  const teams = useLoaderData<typeof loader>();
  const [teamId, setTeamId] = useState<string | undefined>();
  const fetcher = useFetcher();
  const [openModal, setOpenModal] = useState(false);
  const navigation = useNavigation();
  console.log({ teams });
  const { user } = useUserContext();
  if (!user) return null;
  console.log({ user });
  const handleModal = (id: string) => {
    setTeamId(id);
    setOpenModal(true);
  };

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    data.set("teamId", teamId as string);
    data.set("action", "invite");
    console.log({ data });
    await fetcher.submit(data, { method: "POST" });
    setOpenModal(false);
  };

  return (
    <div className="container max-w-4xl mx-auto mb-28">
      <CustomModal isOpen={openModal} setIsOpen={setOpenModal}>
        <div className="flex flex-col gap-2 p-4">
          <div className="text-xl font-semibold dark:text-zinc-100">
            Invite Members
          </div>
          <div className="text-base text-zinc-500">
            Invite members to your team
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm text-zinc-500">Team Code</div>
            <div className="bg-zinc-200 dark:bg-zinc-800  dark:bg-opacity-30  p-2 rounded-full flex justify-center">
              <h4 className="text-lg text-zinc-800 dark:text-zinc-200">
                {teamId}
              </h4>
            </div>
          </div>
          <fetcher.Form
            onSubmit={handleInvite}
            ref={formRef}
            className="flex flex-col gap-3 "
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm text-zinc-500">Name</div>
              <TextInput type="text" name="inviteName" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-zinc-500">Email</div>
              <TextInput type="email" name="inviteEmail" />
            </div>
            <div className="flex flex-col gap-2">
              <LoadingButton
                Icon={UserPlus2Icon}
                buttonName="Invite"
                buttonText="Invite User"
                onClick={() => fetcher.submit(formRef.current)}
                loadingText="Inviting"
                loading={
                  fetcher.state === "loading" || fetcher.state === "submitting"
                }
              />
            </div>
          </fetcher.Form>
        </div>
      </CustomModal>
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
                <button
                  className="bg-indigo-500 rounded-lg text-sm px-2 py-2 text-zinc-100 hover:bg-indigo-400"
                  onClick={() => handleModal(team.id)}
                >
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
