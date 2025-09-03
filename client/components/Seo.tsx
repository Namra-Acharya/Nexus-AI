import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  path?: string; // canonical path, defaults to current pathname
  image?: string; // absolute or relative OG image
}

export default function Seo({ title, description, path, image = "/placeholder.svg" }: SeoProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const ensureTag = (selector: string, create: () => HTMLElement) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      if (!el) { el = create(); document.head.appendChild(el); }
      return el as HTMLElement;
    };

    const setMeta = (name: string, content: string) => {
      const el = ensureTag(`meta[name='${name}']`, () => {
        const m = document.createElement("meta");
        m.setAttribute("name", name);
        return m;
      }) as HTMLMetaElement;
      el.setAttribute("content", content);
    };

    const setProp = (property: string, content: string) => {
      const el = ensureTag(`meta[property='${property}']`, () => {
        const m = document.createElement("meta");
        m.setAttribute("property", property);
        return m;
      }) as HTMLMetaElement;
      el.setAttribute("content", content);
    };

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    const canonicalUrl = origin + (path ?? pathname);

    setMeta("description", description);

    // Canonical link
    let link = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", canonicalUrl);

    // Open Graph / Twitter
    setProp("og:title", title);
    setProp("og:description", description);
    setProp("og:type", "website");
    setProp("og:url", canonicalUrl);
    setProp("og:image", image.startsWith("http") ? image : origin + image);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image.startsWith("http") ? image : origin + image);

    return () => { document.title = prevTitle; };
  }, [title, description, path, image]);

  return null;
}
