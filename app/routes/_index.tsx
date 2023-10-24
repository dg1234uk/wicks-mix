import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { combineLists } from "../utils/wicks-mix";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Wicks Mix" },
    {
      name: "description",
      content:
        "A tool to combine two shopping lists from Joe Wick's Bodycoach app.",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const list1 = String(form.get("list1"));
  const list2 = String(form.get("list2"));

  if (typeof list1 !== "string" || typeof list2 !== "string") {
    return new Response("Invalid form types", { status: 400 });
  }

  const output = combineLists([list1, list2]);

  return json({ output }, { status: 200 });
};

function copyTextToClipboard(
  text: string,
  event: React.MouseEvent<HTMLButtonElement>,
): React.MouseEvent<HTMLButtonElement> {
  if (!navigator.clipboard) {
    console.error("Clipboard API not available");
    return event;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Could not copy text: ", err);
    },
  );
  return event;
}

export function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h2>
  );
}
export function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  );
}

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <div className="mx-auto my-2 max-w-7xl px-2 sm:px-6 lg:px-8">
      <header className="text-center md:text-left">
        <TypographyH1>Wicks Mix</TypographyH1>
      </header>
      <Form method="post" action="/?index#result">
        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label htmlFor="list1">
              <TypographyH2>List 1:</TypographyH2>
            </label>
            <Textarea
              id="list1"
              name="list1"
              rows={10}
              placeholder="Shopping List 1"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="list2">
              <TypographyH2>List 2:</TypographyH2>
            </label>
            <Textarea
              id="list2"
              name="list2"
              rows={10}
              placeholder="Shopping List 2"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Combine Lists
          </Button>
        </div>
      </Form>

      {data?.output ? (
        <div id="result" className="mt-8">
          <TypographyH2>Combined Shopping List</TypographyH2>
          <pre className="relative overflow-x-scroll rounded-md bg-gray-300 p-4">
            <Button
              variant={"outline"}
              size={"icon"}
              className="absolute right-2 top-2"
              onClick={(event) => copyTextToClipboard(data.output, event)}
            >
              Copy
            </Button>
            {data.output}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
