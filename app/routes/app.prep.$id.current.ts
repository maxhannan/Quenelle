import { LoaderArgs } from "@remix-run/node";
import { getPrepListById } from "~/utils/prepList.server";

export async function loader({ params }: LoaderArgs) {
  if (!params.id) return null;
  const prepList = await getPrepListById(params.id);
  return prepList;
}
