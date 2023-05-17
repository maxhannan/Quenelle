import {
  ArrowLongRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import LoadingButton from "~/components/buttons/LoadingButton";
import TextInput from "~/components/formInputs/TextInput";
import { getUser, login } from "~/utils/auth.server";
import { validateName, validatePasswordLogin } from "~/utils/validators.server";

export async function loader({ request }: LoaderArgs) {
  return (await getUser(request)) ? redirect("/app/recipes") : null;
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;
  const errors = {
    username: validateName(username),
    password: validatePasswordLogin(password),
  };
  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { username, password },
        form: action,
      },
      { status: 400 }
    );
  return await login({ username, password });
}

const LoginPage = () => {
  const navigation = useNavigation();
  const actionData = useActionData();

  if (navigation.state === "loading") {
    return <Spinner size={14} />;
  }

  return (
    <Form
      method="post"
      className="container max-w-md px-4 mx-auto flex flex-col gap-3"
    >
      <h2 className="text-4xl dark:text-neutral-200 text-neutral-800 flex items-center justify-between px-1">
        Login <UserCircleIcon className="w-10 h-10" />
      </h2>
      <div className="text-xs font-semibold tracking-wide text-red-500 w-full">
        {actionData?.error?.form || ""}
      </div>
      <TextInput
        name="username"
        placeholder="Username"
        error={actionData?.errors?.username}
      />
      <TextInput
        name="password"
        placeholder="Password"
        type="password"
        error={actionData?.errors?.password}
      />
      <LoadingButton
        loading={navigation.state === "submitting"}
        type="submit"
        buttonName="Login"
        buttonText="Login"
        loadingText="Logging in..."
        Icon={ArrowLongRightIcon}
      />
      <Link
        to={"/register"}
        className=" text-violet-500 dark:text-violet-400 px-1  inline-flex gap-2 items-center hover:text-violet-600 dark:hover:text-violet-500 "
      >
        <span>Don't have an account? Sign up here.</span>
        <ArrowLongRightIcon className="w-5 h-5 pt-1  " />
      </Link>
    </Form>
  );
};

export default LoginPage;
