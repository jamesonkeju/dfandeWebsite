import { useMemo } from "react";
import { useGetContentBlocksQuery, type ContentBlock } from "@/features/content/api/contentApi";

/**
 * Wraps one shared content-blocks fetch and exposes typed, trust-boundary-
 * explicit accessors. getText/getHtml are kept separate on purpose:
 * getHtml is the only helper safe to pass to dangerouslySetInnerHTML
 * (the API only ever sanitizes RichText values server-side), so a
 * PlainText field can never accidentally render raw HTML and a RichText
 * field never shows literal tags via plain interpolation.
 */
export function useContent() {
  const { data, isLoading } = useGetContentBlocksQuery();

  const byKey = useMemo(() => {
    const map = new Map<string, ContentBlock>();
    for (const block of data ?? []) map.set(block.key, block);
    return map;
  }, [data]);

  function getText(key: string, fallback = ""): string {
    return byKey.get(key)?.textValue ?? fallback;
  }

  function getHtml(key: string, fallback = ""): string {
    const block = byKey.get(key);
    return block?.valueType === "RichText" ? (block.textValue ?? fallback) : fallback;
  }

  function getList(key: string): string[] {
    return byKey.get(key)?.listValue ?? [];
  }

  function getJson<T>(key: string, fallback: T): T {
    const raw = byKey.get(key)?.jsonValue;
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  function getNumber(key: string, fallback = 0): number {
    const raw = byKey.get(key)?.textValue;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  /** Resolves {{other.key}} placeholders against this same content set. */
  function resolveTemplate(text: string): string {
    return text.replace(/\{\{([\w.]+)\}\}/g, (_match, key: string) => getText(key, ""));
  }

  return { isLoading, getText, getHtml, getList, getJson, getNumber, resolveTemplate };
}
