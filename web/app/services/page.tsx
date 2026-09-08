import type { Metadata } from "next";
import { OG_BASE } from "../layout";
import ServicesView from "./view";

export const metadata: Metadata = {
  title: "Services | Cyphernaut",
  description: "Twelve services, four pillars, one team: launch, amplify, community, reach and trust for crypto and Web3 projects.",
  alternates: { canonical: "/services" },
  openGraph: {
    ...OG_BASE,
    title: "Services | Cyphernaut",
    description: "Twelve services, four pillars, one team: launch, amplify, community, reach and trust for crypto and Web3 projects.",
    url: "/services",
  },
};

export default function Page() {
  return <ServicesView />;
}
