import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { GeneralErrorBoundary } from "./components/ui/error-boundary";

export const meta: MetaFunction = () => {
  return [
    { title: "Wicks Mix" },
    {
      name: "description",
      content: `A tool to combine two shopping lists from Joe Wick's Bodycoach app.`,
    },
  ];
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  );
}
