import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFormAction,
  useNavigation,
} from "@remix-run/react";
import { combineLists } from "../utils/wicks-mix";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";

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

type ActionErrors = {
  formErrors: Array<string>;
  fieldErrors: {
    list1: Array<string>;
    list2: Array<string>;
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const list1 = String(form.get("list1"));
  const list2 = String(form.get("list2"));

  if (typeof list1 !== "string" || typeof list2 !== "string") {
    return new Response("Invalid form types", { status: 400 });
  }

  const errors: ActionErrors = {
    formErrors: [],
    fieldErrors: {
      list1: [],
      list2: [],
    },
  };

  if (list1 === "") {
    errors.fieldErrors.list1.push("List 1 is required");
  }
  // if (title.length > titleMaxLength) {
  //   errors.fieldErrors.title.push("Title must be at most 100 characters");
  // }
  if (list2 === "") {
    errors.fieldErrors.list2.push("List 2 is required");
  }
  // if (content.length > contentMaxLength) {
  //   errors.fieldErrors.content.push("Content must be at most 10000 characters");
  // }

  const hasErrors =
    errors.formErrors.length ||
    Object.values(errors.fieldErrors).some((fieldErrors) => fieldErrors.length);
  if (hasErrors) {
    return json({ status: "error", errors } as const, { status: 400 });
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

function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h2>
  );
}
function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      {children}
    </h2>
  );
}

function ErrorList({
  id,
  errors,
}: {
  id?: string;
  errors?: Array<string> | null;
}) {
  return errors?.length ? (
    <ul id={id} className="flex flex-col gap-1">
      {errors.map((error, i) => (
        <li key={i} className="text-sm text-red-600">
          {error}
        </li>
      ))}
    </ul>
  ) : null;
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export default function Index() {
  const data = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();
  const formAction = useFormAction();
  const isSubmitting =
    navigation.state !== "idle" &&
    navigation.formMethod === "POST" &&
    navigation.formAction === formAction;

  const fieldErrors = data?.status === "error" ? data.errors.fieldErrors : null;
  const formErrors = data?.status === "error" ? data.errors.formErrors : null;
  const isHydrated = useHydrated();

  const formHasErrors = Boolean(formErrors?.length);
  const formErrorId = formHasErrors ? "form-error" : undefined;
  const list1HasErrors = Boolean(fieldErrors?.list1.length);
  const list1ErrorId = list1HasErrors ? "list1-error" : undefined;
  const list2HasErrors = Boolean(fieldErrors?.list2.length);
  const list2ErrorId = list2HasErrors ? "list2-error" : undefined;

  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;
    if (data?.status !== "error") return;

    if (formEl.matches('[aria-invalid="true"]')) {
      formEl.focus();
    } else {
      const firstInvalid = formEl.querySelector('[aria-invalid="true"]');
      if (firstInvalid instanceof HTMLElement) {
        firstInvalid.focus();
      }
    }
  }, [data]);

  return (
    <div className="mx-auto my-2 max-w-7xl px-2 sm:px-6 lg:px-8">
      <header className="text-center md:text-left">
        <TypographyH1>Wicks Mix</TypographyH1>
      </header>
      <Form
        method="post"
        action="/?index#result"
        noValidate={isHydrated}
        aria-invalid={formHasErrors || undefined}
        aria-describedby={formErrorId}
        ref={formRef}
        tabIndex={-1}
      >
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
              required
              aria-invalid={list1HasErrors || undefined}
              aria-describedby={list1ErrorId}
              autoFocus
            />
            <div>
              <ErrorList id={list1ErrorId} errors={fieldErrors?.list1} />
            </div>
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
              required
              aria-invalid={list2HasErrors || undefined}
              aria-describedby={list2ErrorId}
            />
          </div>
          <div>
            <ErrorList id={list2ErrorId} errors={fieldErrors?.list2} />
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? `Combinging...` : `Combine Lists`}
          </Button>
        </div>
        <ErrorList id={formErrorId} errors={formErrors} />
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
