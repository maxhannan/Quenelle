import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import ErrorBoundaryLayout from "./routes/app/ErrorBoundary";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  {
    rel: "manifest",
    href: "/manifest.json",
    id: "manifest-placeholder",
  },
];

export function ErrorBoundary() {
  return <ErrorBoundaryLayout />;
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="title" content="Quenelle" />
        <meta
          name="theme-color"
          content="#27272a"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1, maximum-scale=1.0,user-scalable=0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="display" content="standalone" />
        <Meta />
        <Links />
      </head>
      <body className="bg-zinc-100 dark:bg-zinc-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
