import {
  ArrowLongRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import React from "react";
import LoadingButton from "~/components/buttons/LoadingButton";
import TextInput from "~/components/formInputs/TextInput";

const LoginPage = () => {
  const navigation = useNavigation();
  const actionData = useActionData();
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
        identifier="username"
        fieldName="Username"
        error={actionData?.errors?.username}
      />
      <TextInput
        identifier="password"
        fieldName="Password"
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
