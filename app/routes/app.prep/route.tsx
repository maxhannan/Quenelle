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
import IconColorButton from "~/components/buttons/IconColorButton";
import ColorButton from "~/components/buttons/ColorButton";
import { set } from "date-fns";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const prepLists = await getPrepLists(user!.teams.map((t) => t.id));
  const templates = await getTemplates(user!.teams.map((t) => t.id));
  return { prepLists, templates };
}
export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const user = await getUser(request);

  if (user) {
    const savedList = await createListFromTemplate(
      form,
      user.id,
      user.teams[0].id
    );

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
  const [selectedTemplate, setSelectedTemplate] = useState<
    string | undefined
  >();
  const [selectedEditTemplate, setSelectedEditTemplate] = useState<
    string | undefined
  >();

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
    } else {
      setSelectedTemplate(undefined);
    }
  };

  const handleEditTemplateChange = (
    value: { id: string; value: string } | null
  ) => {
    if (value) {
      setSelectedEditTemplate(value.id);
    } else {
      setSelectedEditTemplate(undefined);
    }
  };

  return (
    <>
      {navigation.state !== "loading" && (
        <CustomModal isOpen={openDialog} setIsOpen={setOpenDialog}>
          <div className=" p-4 flex flex-col  gap-2">
            <Form
              method="POST"
              action="/app/prep/"
              onSubmit={() => setSelectedTemplate(undefined)}
            >
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
                <div className="w-full flex gap-1  ">
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
                    <IconColorButton
                      Icon={ArrowRightIcon}
                      type="submit"
                      color="green"
                      disabled={
                        navigation.state === "submitting" || !selectedTemplate
                          ? true
                          : false
                      }
                      loading={navigation.state === "submitting"}
                      name="create"
                    />
                  </div>
                </div>
              </div>
            </Form>
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-500"></div>
              <span className="flex-shrink mx-4 text-zinc-500">Or</span>
              <div className="flex-grow border-t border-zinc-500"></div>
            </div>
            <div className="w-full flex flex-col gap-2  ">
              <ComboBox
                name="template"
                required
                changeHandler={handleEditTemplateChange}
                selectedLinkId={selectedEditTemplate ?? undefined}
                options={
                  templates
                    ? templates.map((t) => ({ id: t.id, value: t.name }))
                    : []
                }
                placeholder="Template"
              />

              <ColorButton
                disabled={
                  navigation.state === "submitting" || !selectedEditTemplate
                }
                color="green"
                onClick={() => {
                  setOpenDialog(false);
                  selectedEditTemplate &&
                    navigate(`edit/${selectedEditTemplate}`);
                  revalidator.revalidate();
                  setSelectedEditTemplate(undefined);
                }}
                name="Add list"
              >
                Edit Template
                <ArrowRightIcon className="h-6 w-6" />
              </ColorButton>
            </div>
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-500"></div>
              <span className="flex-shrink mx-4 text-zinc-500">Or</span>
              <div className="flex-grow border-t border-zinc-500"></div>
            </div>

            <ColorButton
              disabled={navigation.state === "submitting"}
              color="green"
              onClick={() => {
                setOpenDialog(false);
                navigate("add");
              }}
              name="Add list"
            >
              Create Custom List
              <ArrowRightIcon className="h-6 w-6" />
            </ColorButton>
          </div>
        </CustomModal>
      )}

      <div className="flex">
        <div className="relative xl:w-1/3 2xl:w-1/4 border-r dark:border-zinc-800 h-screen bg-zinc-100  dark:bg-zinc-900 overflow-y-scroll flex-none hidden xl:flex scrollbar-none scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900 scrollbar-thumb-zinc-600 dark:scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-2xl">
          <div className=" container mx-auto max-w-4xl px-3">
            <PrepPage
              date={date}
              handleDateChange={handleDateChange}
              pageChangeLoading={true}
              //@ts-expect-error
              prepLists={prepLists}
              setOpenDialog={setOpenDialog}
            />
          </div>
        </div>
        <div className="container  mx-auto xl:h-screen xl:overflow-y-scroll scrollbar-none">
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
