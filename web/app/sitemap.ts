import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

export const dynamic = "force-static";

/* Mirrors the routes in app/ plus the WebGL entry page, which is a static file
   in public/ rather than a route and would otherwise be left out of the map
   entirely. trailingSlash is on in next.config, so the emitted URLs carry it
   too — a sitemap that disagrees with the served URL costs a redirect on every
   crawl. */
const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/about/", priority: 0.9 },
  { path: "/services/", priority: 0.8 },
  { path: "/launch/", priority: 0.8 },
  { path: "/team/", priority: 0.6 },
  { path: "/book-a-call/", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
