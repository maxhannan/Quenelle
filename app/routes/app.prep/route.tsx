import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useOutletContext,
  useRevalidator,
  useSearchParams,
} from "@remix-run/react";
import CustomModal from "~/components/display/CustomModal";
import ComboBox from "~/components/formInputs/ComboBox";
import {
  createListFromTemplate,
  getPrepLists,
  getTemplates,
} from "~/utils/prepList.server";
import PrepCalendar from "../app.prep._index/components/PrepCalendar";
import IconButton from "~/components/buttons/IconButton";
import LoadingButton from "~/components/buttons/LoadingButton";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Dispatch } from "react";
import { getUser } from "~/utils/auth.server";

import PrepPage from "../app.prep._index/components/PrepPage";

export async function loader({ request }: LoaderArgs) {
  const prepLists = await getPrepLists();
  const templates = await getTemplates();
  return { prepLists, templates };
}
export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const user = await getUser(request);

  if (user) {
    const savedList = await createListFromTemplate(form, user.id);

    if (savedList) {
      return redirect(savedList.id);
    }
  }
  return undefined;
}

type ContextType = {
  prepLists: Awaited<ReturnType<typeof loader>>["prepLists"];
  templates: Awaited<ReturnType<typeof getTemplates>>;
  handleDateChange: (date: Date) => void;
  setOpenDialog: Dispatch<React.SetStateAction<boolean>>;
  date: Date;
};

function PrepListsLayout() {
  const { prepLists, templates } = useLoaderData<ContextType>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const [date, setDate] = useState<Date>(
    new Date(searchParams.get("date") ?? Date.now())
  );

  const [openDialog, setOpenDialog] = useState(false);

  const [templateDate, setTemplateDate] = useState<Date>(date);
  const data = useActionData();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>();
  useEffect(() => {
    if (data !== undefined) {
      console.log({ data, openDialog });
      if (location.pathname === "/app/prep") {
        navigate(`/app/prep/${data}`, { replace: true });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setOpenDialog(false);
  }, [location.pathname]);
  useEffect(() => {
    if (date) {
      setTemplateDate(date);
    }
  }, [date]);

  const handleDateChange = (date: Date) => {
    searchParams.set("date", date.toDateString());
    setSearchParams(searchParams);
    setDate(date);
  };

  const handleTemplateDateChange = (date: Date) => {
    setTemplateDate(date);
  };

  const handleTemplateChange = (
    value: { id: string; value: string } | null
  ) => {
    if (value) {
      setSelectedTemplate(value.id);
    }
  };

  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== "/app/prep";

  return (
    <>
      {navigation.state !== "loading" && (
        <CustomModal isOpen={openDialog} setIsOpen={setOpenDialog}>
          <div className=" p-4 flex flex-col  gap-2">
            <Form method="POST" action="/app/prep/">
              <div className="flex gap-2 flex-col">
                <ComboBox
                  name="template"
                  required
                  changeHandler={handleTemplateChange}
                  selectedLinkId={selectedTemplate ?? undefined}
                  options={
                    templates
                      ? templates.map((t) => ({ id: t.id, value: t.name }))
                      : []
                  }
                  placeholder="Template"
                />
                <div className="w-full flex gap-2  ">
                  <div className="grow">
                    <input
                      type="hidden"
                      name="templateDate"
                      value={templateDate.toString()}
                    />
                    <PrepCalendar
                      date={templateDate}
                      handleDateChange={handleTemplateDateChange}
                    />
                  </div>
                  <div className="flex-none">
                    <IconButton
                      Icon={ArrowRightIcon}
                      type="submit"
                      disabled={
                        navigation.state === "submitting" || !selectedTemplate
                      }
                      loading={navigation.state === "submitting"}
                      name="create"
                      onClick={() => console.log(false)}
                    />
                  </div>
                </div>
              </div>
            </Form>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-700"></div>
              <span className="flex-shrink mx-4 text-zinc-400">Or</span>
              <div className="flex-grow border-t border-zinc-700"></div>
            </div>
            <div className="w-full flex flex-col gap-2  ">
              <ComboBox
                name="template"
                required
                changeHandler={handleTemplateChange}
                selectedLinkId={selectedTemplate ?? undefined}
                options={
                  templates
                    ? templates.map((t) => ({ id: t.id, value: t.name }))
                    : []
                }
                placeholder="Template"
              />
              <div className="grow">
                <LoadingButton
                  disabled={
                    navigation.state === "submitting" || !selectedTemplate
                  }
                  buttonText="Edit Template"
                  Icon={ArrowRightIcon}
                  action={() => {
                    setOpenDialog(false);
                    selectedTemplate && navigate(`edit/${selectedTemplate}`);
                    revalidator.revalidate();
                  }}
                  buttonName="Add list"
                />
              </div>
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-700"></div>
              <span className="flex-shrink mx-4 text-zinc-400">Or</span>
              <div className="flex-grow border-t border-zinc-700"></div>
            </div>
            <div className="w-full flex gap-2  ">
              <div className="grow">
                <LoadingButton
                  disabled={navigation.state === "submitting"}
                  buttonText="Create Custom List"
                  Icon={ArrowRightIcon}
                  action={() => {
                    setOpenDialog(false);
                    navigate("add");
                  }}
                  buttonName="Add list"
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}

      <div className="flex">
        <div className="relative w-1/3  h-screen bg-zinc-50 dark:bg-zinc-950 overflow-y-scroll flex-none hidden xl:flex scrollbar-thin scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900 scrollbar-thumb-zinc-600 dark:scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-2xl">
          <div className=" container mx-auto max-w-4xl px-3">
            <PrepPage
              date={date}
              handleDateChange={handleDateChange}
              pageChangeLoading={true}
              prepLists={prepLists}
              setOpenDialog={setOpenDialog}
            />
          </div>
        </div>
        <div className="w-full xl:h-screen xl:overflow-y-scroll scrollbar-none">
          <Outlet
            context={{
              prepLists,
              templates,
              handleDateChange,
              setOpenDialog,
              date,
            }}
          />
        </div>
      </div>
    </>
  );
}

export function usePrepLists() {
  return useOutletContext<ContextType>();
}

export default PrepListsLayout;
