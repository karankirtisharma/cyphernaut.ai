import type { Metadata } from "next";
import { OG_BASE } from "./layout";
import HomeView from "./view";

export const metadata: Metadata = {
  title: "Cyphernaut | AI and Web3 launch marketing",
  description: "Cyphernaut plans, launches and grows AI and Web3 projects: strategy, tokenomics, marketing and community, from first announcement to sustained growth.",
  alternates: { canonical: "/" },
  openGraph: {
    ...OG_BASE,
    title: "Cyphernaut | AI and Web3 launch marketing",
    description: "Cyphernaut plans, launches and grows AI and Web3 projects: strategy, tokenomics, marketing and community, from first announcement to sustained growth.",
    url: "/",
  },
};

export default function Page() {
  return <HomeView />;
}
