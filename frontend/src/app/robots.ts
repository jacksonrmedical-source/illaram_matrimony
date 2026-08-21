import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/profiles",
          "/interests",
          "/chat",
          "/premium",
          "/profile",
          "/api",
        ],
      },
    ],
    sitemap: "https://www.illaram.com/sitemap.xml",
  };
}