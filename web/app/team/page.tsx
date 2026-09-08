import type { Metadata } from "next";
import { OG_BASE } from "../layout";
import TeamView from "./view";

export const metadata: Metadata = {
  title: "The crew | Cyphernaut",
  description: "Four people. Every engagement, end to end. The team behind Cyphernaut's crypto and Web3 launches.",
  alternates: { canonical: "/team" },
  openGraph: {
    ...OG_BASE,
    title: "The crew | Cyphernaut",
    description: "Four people. Every engagement, end to end. The team behind Cyphernaut's crypto and Web3 launches.",
    url: "/team",
  },
};

export default function Page() {
  return <TeamView />;
}
