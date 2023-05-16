import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function useDataFromLoader<LoaderFn extends LoaderFunction>(
  loaderFn: LoaderFn
) {
  return useLoaderData() as Awaited<ReturnType<typeof loaderFn>>;
}
