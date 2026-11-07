import nodemailer from "nodemailer";

type ContactMessage = {
  name: string;
  email: string;
  project: string;
  budget: string;
  locale: string;
};

function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_MOCK } = process.env;

  // Transport simulé : tests, et développement sans SMTP. Jamais en production sans SMTP_MOCK.
  if (SMTP_MOCK === "1" || (!SMTP_HOST && process.env.NODE_ENV !== "production")) {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP non configuré");
  }

  const port = Number(SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function deliverContact({ name, email, project, budget, locale }: ContactMessage) {
  const to = process.env.CONTACT_TO ?? "mehdi.amamou4@gmail.com";
  const from = process.env.SMTP_USER ?? "portfolio@localhost";
  const singleLine = name.replace(/[\r\n]+/g, " ");

  const info = await transport().sendMail({
    from: { name: "Portfolio Mehdi Amamou", address: from },
    to,
    replyTo: { name: singleLine, address: email },
    subject: `Nouvelle demande : ${singleLine}`,
    text: [
      `Nom : ${singleLine}`,
      `E-mail : ${email}`,
      `Budget : ${budget || "non précisé"}`,
      `Langue du visiteur : ${locale}`,
      "",
      project,
    ].join("\n"),
  });

  if (process.env.NODE_ENV !== "production") console.info("[contact] envoi simulé", info.messageId);
}
