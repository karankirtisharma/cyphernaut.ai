import type { Metadata } from "next";
import { OG_BASE } from "../layout";
import TeamView from "./view";

export const metadata: Metadata = {
  title: "The founder | Cyphernaut",
  description: "One founder. Every engagement, end to end. The person behind Cyphernaut's AI and Web3 launches.",
  alternates: { canonical: "/team" },
  openGraph: {
    ...OG_BASE,
    title: "The founder | Cyphernaut",
    description: "One founder. Every engagement, end to end. The person behind Cyphernaut's AI and Web3 launches.",
    url: "/team",
  },
};

export default function Page() {
  return <TeamView />;
}
