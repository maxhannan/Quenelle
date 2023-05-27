import React from "react";
import { usePrepList } from "../app.prep.$id/route";
import { useNavigate, useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";

function PrepListRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const prepList = usePrepList();

  if (navigation.state === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <div className=" container mx-auto mb-28 max-w-4xl ">{prepList?.name}</div>
  );
}

export default PrepListRoute;
