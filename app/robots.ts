import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://positiveonworldwide.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/profile/", "/orders/"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
