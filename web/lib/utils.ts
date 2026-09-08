/** Joins class names, skipping falsy values.
 *
 *  shadcn's `cn` is `clsx` + `tailwind-merge`; this project has no Tailwind, so
 *  there are no utility conflicts to resolve and the merge half would be dead
 *  weight. Same call signature, no dependencies. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
