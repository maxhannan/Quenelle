import React from "react";
import SlideUpTransition from "~/components/animations/SlideUp";
import { useSetProgress } from "../_auth_.setup/route";
import LoadingButton from "~/components/buttons/LoadingButton";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate, useNavigation } from "@remix-run/react";

function TeamSetupRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { setProgress } = useSetProgress();
  setProgress(66);
  return (
    <SlideUpTransition>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl text-zinc-800 dark:text-zinc-200  ">
          Your Team Code
        </h3>
        <div className="bg-zinc-200 dark:bg-zinc-800  dark:bg-opacity-30  p-2 rounded-full flex justify-center">
          <h4 className="text-lg text-zinc-800 dark:text-zinc-200">
            gdfskljghFS21987CVAW0E89FG7
          </h4>
        </div>
        <h4 className="text-lg text-zinc-600 dark:text-zinc-400">
          Don't worry, you can always access this later
        </h4>
        <LoadingButton
          Icon={ArrowRightIcon}
          action={() => {
            navigate("/pending");
          }}
          loading={navigation.state === "loading"}
          loadingText="Creating Team..."
          buttonName="SignUp"
          buttonText="Let's get started!"
          placeholder="Team Name"
        />
      </div>
    </SlideUpTransition>
  );
}

export default TeamSetupRoute;
