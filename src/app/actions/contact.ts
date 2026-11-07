"use server";

import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { CONTACT_FIELDS, contactSchema, type ContactField, type ContactState } from "@/lib/contact-schema";
import { deliverContact } from "@/lib/mailer";
import { allowRequest } from "@/lib/rate-limit";

const text = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
};

async function clientAddress() {
  const list = await headers();
  // X-Real-IP est posé par Nginx. Dans X-Forwarded-For, seule la dernière valeur est fiable.
  return (
    list.get("x-real-ip") ??
    list.get("x-forwarded-for")?.split(",").pop()?.trim() ??
    "local"
  );
}

export async function sendContact(_: ContactState, data: FormData): Promise<ContactState> {
  // Champ piège rempli : on répond comme si tout allait bien, sans rien envoyer.
  if (text(data, "website")) return { status: "sent" };

  const locale = text(data, "locale") === "en" ? "en" : "fr";
  const parsed = contactSchema.safeParse({
    name: text(data, "name"),
    email: text(data, "email"),
    project: text(data, "project"),
    budget: text(data, "budget"),
  });

  if (!parsed.success) {
    const fields = new Set(parsed.error.issues.map((issue) => issue.path[0]));
    return {
      status: "invalid",
      fields: CONTACT_FIELDS.filter((field: ContactField) => fields.has(field)),
    };
  }

  const t = await getTranslations({ locale, namespace: "contact" });

  if (!allowRequest(await clientAddress())) {
    return { status: "failed", message: t("errRate") };
  }

  try {
    await deliverContact({ ...parsed.data, locale });
  } catch (error) {
    console.error("[contact] envoi impossible", error);
    return { status: "failed", message: t("errSend") };
  }

  return { status: "sent" };
}
