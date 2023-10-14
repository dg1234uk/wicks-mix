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

  if (list1 === null || list2 === null) {
    return json(
      {
        output: null,
        fieldErrors: null,
        fields: null,
        formError: "Requires a list",
      },
      { status: 400 },
    );
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
    <div className="m-8">
      <TypographyH1>Wicks Mix</TypographyH1>
      <Form method="post">
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <div className="w-5/12">
            <label htmlFor="list1">
              <TypographyH2>List 1:</TypographyH2>
            </label>
            <Textarea
              name="list1"
              id="list1"
              rows={10}
              placeholder="Shopping List 1"
            />
          </div>
          <div className="w-5/12">
            <label htmlFor="list2">
              <TypographyH2>List 2:</TypographyH2>
            </label>
            <Textarea
              name="list2"
              id="list2"
              rows={10}
              placeholder="Shopping List 2"
            />
          </div>
        </div>
        <div className="mt-8">
          <Button type="submit">Combine Lists</Button>
        </div>
      </Form>
      <div className="mt-8">
        <TypographyH2>Combined Shopping List</TypographyH2>
        {data?.output ? (
          <pre className="relative bg-gray-300 p-4 rounded-md">
            <Button
              variant={"outline"}
              size={"icon"}
              className="absolute top-2 right-2"
              onClick={(event) => copyTextToClipboard(data.output, event)}
            >
              Copy
            </Button>
            {data.output}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
