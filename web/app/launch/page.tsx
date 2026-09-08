import type { Metadata } from "next";
import { OG_BASE } from "../layout";
import LaunchView from "./view";

export const metadata: Metadata = {
  title: "The launch lifecycle | Cyphernaut",
  description: "Pre-launch, launch day and the months that follow: how Cyphernaut runs an AI or Web3 launch from anticipation to momentum.",
  alternates: { canonical: "/launch" },
  openGraph: {
    ...OG_BASE,
    title: "The launch lifecycle | Cyphernaut",
    description: "Pre-launch, launch day and the months that follow: how Cyphernaut runs an AI or Web3 launch from anticipation to momentum.",
    url: "/launch",
  },
};

export default function Page() {
  return <LaunchView />;
}
