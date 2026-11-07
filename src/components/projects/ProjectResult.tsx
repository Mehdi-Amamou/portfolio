import { isPlaceholder } from "@/content/site";

export function ProjectResult({ value }: { value: string }) {
  return <span className={isPlaceholder(value) ? "mh-ph" : "mh-result"}>{value}</span>;
}
