import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { combineLists } from "../utils/wicks-mix";

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

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <div>
      <h1>Wicks Mix</h1>
      <Form method="post">
        <div>
          <div>
            <h2>List 1:</h2>
            <div>
              <label htmlFor="list1">List 1</label>
              <textarea
                name="list1"
                id="list1"
                rows={10}
                placeholder="Shopping List 1"
              />
            </div>
          </div>
          <div>
            <h2>List 2:</h2>
            <div>
              <label htmlFor="list2">List 2</label>
              <textarea
                name="list2"
                id="list2"
                rows={10}
                placeholder="Shopping List 2"
              />
            </div>
          </div>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
      <div>
        <h2>Combined Shopping List:</h2>
        {data?.output ? (
          <pre>
            <button
              onClick={(event) => copyTextToClipboard(data.output, event)}
            >
              Copy
            </button>
            {data.output}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
