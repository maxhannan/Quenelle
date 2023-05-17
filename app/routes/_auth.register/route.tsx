import {
  ArrowLongRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { FC } from "react";
import Spinner from "~/components/LoadingSpinner";
import LoadingButton from "~/components/buttons/LoadingButton";
import TextInput from "~/components/formInputs/TextInput";
import { Register, getUser } from "~/utils/auth.server";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "~/utils/validators.server";

export async function loader({ request }: LoaderArgs) {
  return (await getUser(request)) ? redirect("/app/recipes") : null;
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const confirmPassword = form.get("confirmPassword") as string;
  const username = form.get("username") as string;
  const firstName = form.get("firstName") as string;
  const lastName = form.get("lastName") as string;

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password, confirmPassword),
    firstName: validateName(firstName || ""),
    lastName: validateName(lastName || ""),
  };
  if (Object.values(errors).some(Boolean)) {
    console.log(errors);
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );
  }
  return await Register({ email, password, username, firstName, lastName });
}

const RegisterPage: FC = () => {
  const actionData = useActionData();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return <Spinner size={14} />;
  }

  return (
    <Form
      method="post"
      className="container max-w-md px-4 mx-auto flex flex-col gap-3"
    >
      <h2 className="px-1 text-4xl dark:text-neutral-200 text-neutral-700 flex items-center justify-between">
        Sign Up <UserCircleIcon className="w-10 h-10" />
      </h2>
      <div className="w-full flex gap-2">
        <TextInput
          identifier="firstName"
          fieldName="First Name"
          error={actionData?.errors?.firstName}
        />
        <TextInput
          identifier="lastName"
          fieldName="Last Name"
          error={actionData?.errors?.lastName}
        />
      </div>
      <TextInput
        identifier="username"
        fieldName="Username"
        error={actionData?.errors?.username}
      />
      <TextInput
        identifier="email"
        fieldName="Email"
        type="email"
        error={actionData?.errors?.email}
      />
      <TextInput
        identifier="password"
        fieldName="Password"
        type="password"
        error={actionData?.errors?.password}
      />
      <TextInput
        identifier="confirmPassword"
        fieldName="Confirm Password"
        type="password"
        error={actionData?.errors?.password}
      />
      <LoadingButton
        loading={navigation.state === "submitting"}
        type="submit"
        buttonName="register"
        buttonText="Sign Up"
        loadingText="Signing up..."
        Icon={ArrowLongRightIcon}
      />
      <Link
        to={"/login"}
        className=" text-violet-500 dark:text-violet-400 px-1  inline-flex gap-2 items-center hover:text-violet-600 dark:hover:text-violet-500 "
      >
        <span> Already Have an account? Sign in here. </span>
        <ArrowLongRightIcon className="w-5 h-5 pt-1  " />
      </Link>
    </Form>
  );
};

export default RegisterPage;
