import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Quenelle",
  viewport:
    "width=device-width,initial-scale=1, maximum-scale=1.0,user-scalable=0 ",
  "apple-mobile-web-app-capable": "yes",

  display: "standalone",
  "mobile-web-app-capable": "yes",

  "apple-touch-fullscreen": "yes",
});

const AuthLayout = () => {
  return (
    <div className=" container max-w-2xl mx-auto h-screen w-screen flex justify-center items-center ">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
