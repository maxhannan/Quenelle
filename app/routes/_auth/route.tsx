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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <meta
          name="theme-color"
          content="#171717"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1, maximum-scale=1.0,user-scalable=0 "
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="display" content="standalone" />
      </head>
      <body>
        <div className=" container max-w-2xl mx-auto h-screen w-screen flex justify-center items-center ">
          <Outlet />
        </div>
      </body>
    </html>
  );
};

export default AuthLayout;
