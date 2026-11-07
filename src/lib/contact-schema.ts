import * as z from "zod/mini";

// Partagé entre le formulaire (validation au blur) et la Server Action.
export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2), z.maxLength(120)),
  email: z.pipe(z.string().check(z.trim(), z.maxLength(200)), z.email()),
  project: z.string().check(z.trim(), z.minLength(10), z.maxLength(4000)),
  budget: z.string().check(z.trim(), z.maxLength(120)),
});

export type ContactField = "name" | "email" | "project";

export const CONTACT_FIELDS: ContactField[] = ["name", "email", "project"];

export const isFieldValid = (field: ContactField, value: string) =>
  contactSchema.shape[field].safeParse(value).success;

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid"; fields: ContactField[] }
  | { status: "failed"; message: string };
