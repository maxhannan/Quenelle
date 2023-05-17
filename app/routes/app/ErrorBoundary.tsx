import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import {
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import LoadingButton from "~/components/buttons/LoadingButton";
import BottomNav from "~/components/navigation/BottomNav";

export default function ErrorBoundaryLayout() {
  const error = useRouteError();
  const location = useLocation();
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  const navigate = useNavigate();
  const navigation = useNavigation();

  if (isRouteErrorResponse(error)) {
    return (
      <div className=" px-4">
        <div className="container max-w-2xl mx-auto flex justify-center items-center flex-col text-neutral-700 gap-3 dark:text-neutral-200 text-lg h-screen w-full">
          <div className="w-2/3 flex flex-col gap-2">
            <h1>Error</h1>
            <p>{error.data}</p>
          </div>
          <div className="w-2/3 flex">
            <LoadingButton
              buttonText="Go Back"
              buttonName="back"
              action={() => navigate("/app/recipes", { replace: true })}
              Icon={ArrowUturnLeftIcon}
              loading={navigation.state === "loading"}
            />
          </div>
        </div>
        <BottomNav page={page} setPage={setPage} />
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className=" px-4">
        <div className="container max-w-2xl mx-auto flex justify-center items-center flex-col text-neutral-700 gap-3 dark:text-neutral-200 text-lg h-screen w-full">
          <div className="w-2/3 flex flex-col gap-2">
            <h1>Error</h1>
            <p>{error.message}</p>
          </div>
          <div className="w-2/3 flex">
            <LoadingButton
              buttonText="Go Back"
              buttonName="back"
              action={() => navigate("/app/recipes", { replace: true })}
              Icon={ArrowUturnLeftIcon}
              loading={navigation.state === "loading"}
            />
          </div>
        </div>
        <BottomNav page={page} setPage={setPage} />
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
