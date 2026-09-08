import type { Metadata } from "next";
import { OG_BASE } from "../layout";
import ServicesView from "./view";

export const metadata: Metadata = {
  title: "Services | Cyphernaut",
  description: "Fifteen services, five pillars, one team: launch, build, amplify, community, reach and trust for AI and Web3 projects.",
  alternates: { canonical: "/services" },
  openGraph: {
    ...OG_BASE,
    title: "Services | Cyphernaut",
    description: "Fifteen services, five pillars, one team: launch, build, amplify, community, reach and trust for AI and Web3 projects.",
    url: "/services",
  },
};

export default function Page() {
  return <ServicesView />;
}
