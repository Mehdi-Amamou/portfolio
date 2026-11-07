"use client";

import { AnimatePresence, m } from "motion/react";
import { useActionState, useRef, useState, type FormEvent } from "react";
import { sendContact } from "@/app/actions/contact";
import { Ic } from "@/components/ui/Ic";
import { isPlaceholder } from "@/content/site";
import {
  CONTACT_FIELDS,
  isFieldValid,
  type ContactField,
  type ContactState,
} from "@/lib/contact-schema";
import { SentCard } from "./SentCard";
import type { ContactLabels } from "./types";

const INITIAL: ContactState = { status: "idle" };

type FieldErrors = Partial<Record<ContactField, boolean>>;

type ContactFormProps = {
  labels: ContactLabels;
  locale: string;
};

function FormBody({ labels, locale, onReset }: ContactFormProps & { onReset: () => void }) {
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(sendContact, INITIAL);
  const [values, setValues] = useState<Record<ContactField, string>>({
    name: "",
    email: "",
    project: "",
  });
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  const serverFields = state.status === "invalid" ? state.fields : [];
  const hasError = (field: ContactField) => errors[field] ?? serverFields.includes(field);
  const errorCount = CONTACT_FIELDS.filter(hasError).length;

  const errorText: Record<ContactField, string> = {
    name: labels.errName,
    email: labels.errEmail,
    project: labels.errProject,
  };

  const check = (field: ContactField, value: string) =>
    setErrors((current) => ({ ...current, [field]: !isFieldValid(field, value) }));

  const onChange = (field: ContactField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (hasError(field)) check(field, value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (pending) {
      event.preventDefault();
      return;
    }
    const invalid = CONTACT_FIELDS.filter((field) => !isFieldValid(field, values[field]));
    setErrors(Object.fromEntries(CONTACT_FIELDS.map((f) => [f, invalid.includes(f)])));
    setAttempted(true);
    if (invalid.length === 0) return;

    event.preventDefault();
    form.current?.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus();
  };

  const field = (name: ContactField) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    className: "mh-input",
    "aria-invalid": hasError(name) || undefined,
    "aria-required": true,
    "aria-describedby": hasError(name) ? `f-${name}-err` : undefined,
    onBlur: () => check(name, values[name]),
  });

  const errorLine = (name: ContactField) =>
    hasError(name) && (
      <p className="mh-err" id={`f-${name}-err`}>
        <Ic name="alert" />
        {errorText[name]}
      </p>
    );

  const showSummary = (attempted || serverFields.length > 0) && errorCount > 0;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "sent" ? (
        <SentCard key="sent" labels={labels} {...values} onReset={onReset} />
      ) : (
        <m.form
          key="form"
          ref={form}
          action={action}
          onSubmit={onSubmit}
          noValidate
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="mh-form-title">{labels.formTitle}</h3>
          <p className="mh-form-sub">{labels.formSub}</p>

          {showSummary && (
            <p className="mh-errsum" role="alert">
              <Ic name="alert" />
              {errorCount}
              {errorCount > 1 ? labels.errMany : labels.errOne}
            </p>
          )}
          {state.status === "failed" && (
            <p className="mh-errsum" role="alert">
              <Ic name="alert" />
              {state.message}
            </p>
          )}

          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="budget" value={budget} />
          <div className="mh-hp" aria-hidden="true">
            <label>
              Site web
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="mh-form-grid">
            <div className={hasError("name") ? "mh-field is-error" : "mh-field"}>
              <label htmlFor="f-name">{labels.name}</label>
              <input
                {...field("name")}
                type="text"
                autoComplete="name"
                placeholder={labels.namePh}
                onChange={(event) => onChange("name", event.target.value)}
              />
              {errorLine("name")}
            </div>
            <div className={hasError("email") ? "mh-field is-error" : "mh-field"}>
              <label htmlFor="f-email">{labels.email}</label>
              <input
                {...field("email")}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={labels.emailPh}
                onChange={(event) => onChange("email", event.target.value)}
              />
              {errorLine("email")}
            </div>
            <div
              className={
                hasError("project") ? "mh-field mh-field--full is-error" : "mh-field mh-field--full"
              }
            >
              <label htmlFor="f-project">{labels.project}</label>
              <textarea
                {...field("project")}
                rows={4}
                placeholder={labels.projectPh}
                onChange={(event) => onChange("project", event.target.value)}
              />
              {errorLine("project")}
            </div>
            <fieldset className="mh-fieldset mh-field--full">
              <legend className="mh-legend">{labels.budget}</legend>
              <div className="mh-budget">
                {labels.budgets.map((option) => {
                  const classes = [
                    !isPlaceholder(option) && "is-real",
                    budget === option && "is-on",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <button
                      key={option}
                      type="button"
                      className={classes || undefined}
                      aria-pressed={budget === option}
                      onClick={() => setBudget(budget === option ? "" : option)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <button
            type="submit"
            className="mh-btn mh-btn--primary mh-btn--lg mh-submit"
            aria-busy={pending}
          >
            <span>{labels.submit}</span>
            <span className="mh-btn-ic">
              {pending ? <span className="mh-spin" /> : <Ic name="right" size="sm" />}
            </span>
          </button>
          <p className="mh-privacy">
            <Ic name="lock" />
            {labels.privacy}
          </p>
        </m.form>
      )}
    </AnimatePresence>
  );
}

export function ContactForm(props: ContactFormProps) {
  const [round, setRound] = useState(0);

  return (
    <div className="mh-form">
      <FormBody key={round} {...props} onReset={() => setRound((value) => value + 1)} />
    </div>
  );
}
