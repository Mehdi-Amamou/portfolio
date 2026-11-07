import { notFound } from "next/navigation";

// Toute adresse inconnue passe par la page 404 traduite.
export default function CatchAll() {
  notFound();
}
