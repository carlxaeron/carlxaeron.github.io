import { mapping } from "../../mapping";

export async function fetchContentSection(section) {
  const url = `${mapping.portfolioContent}/${encodeURIComponent(section)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json().catch(() => null);
    const payload = json?.data ?? json;
    const content = payload?.content;

    return content ?? null;
  } catch {
    return null;
  }
}
