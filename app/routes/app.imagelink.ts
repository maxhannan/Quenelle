import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const ImageLink = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_USER}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API}`,
      },
    }
  );
  console.log({ ImageLink });
  return ImageLink;
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const deleted = data.get("deleted") as string;
  if (deleted) {
    const deleteIds = JSON.parse(deleted);
    const success = deleteIds.map(async (id: string) => {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_USER}/images/v1/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API}`,
          },
        }
      );
      return response;
    });
    console.log({ success });
    return success;
  }

  return null;
};
