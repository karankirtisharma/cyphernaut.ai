import type { Metadata } from "next";
import { OG_BASE } from "./layout";
import HomeView from "./view";

export const metadata: Metadata = {
  title: "Cyphernaut | AI and Web3 launch marketing",
  description: "Cyphernaut builds, launches and grows AI and Web3 projects: production software, strategy, marketing and community, from first commit to sustained growth.",
  alternates: { canonical: "/" },
  openGraph: {
    ...OG_BASE,
    title: "Cyphernaut | AI and Web3 launch marketing",
    description: "Cyphernaut builds, launches and grows AI and Web3 projects: production software, strategy, marketing and community, from first commit to sustained growth.",
    url: "/",
  },
};

export default function Page() {
  return <HomeView />;
}
