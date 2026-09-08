import type { Metadata } from "next";
import { OG_BASE } from "../layout";
import BookView from "./view";

export const metadata: Metadata = {
  title: "Book a call | Cyphernaut",
  description: "A 30-minute call about the project: what it is, where it is, and what a launch would take.",
  alternates: { canonical: "/book-a-call" },
  openGraph: {
    ...OG_BASE,
    title: "Book a call | Cyphernaut",
    description: "A 30-minute call about the project: what it is, where it is, and what a launch would take.",
    url: "/book-a-call",
  },
};

export default function Page() {
  return <BookView />;
}
