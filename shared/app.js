import { supabase } from "./supabase.js";

export function detectLang() {
  return location.pathname.startsWith("/ja/") ? "ja" : "en";
}

export function buildAltLangUrl() {
  const isJa = location.pathname.startsWith("/ja/");
  if (isJa) return location.pathname.replace(/^\/ja\//, "/");
  return `/ja${location.pathname}`;
}

export function mountLangToggle() {
  const a = document.querySelector("[data-lang-toggle]");
  if (!a) return;
  a.setAttribute("href", buildAltLangUrl() + location.search);
  a.textContent = detectLang() === "ja" ? "EN" : "JA";
}

export function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

export function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  for (const c of children) node.append(c);
  return node;
}

export function card(title, bodyNode) {
  return el("section", { class: "card" }, [el("h2", {}, [title]), bodyNode]);
}

export function chips(items = []) {
  return el(
    "div",
    { class: "chips" },
    items.map((t) => el("span", {}, [t]))
  );
}

export function linkRow(links = []) {
  return el(
    "div",
    { class: "links" },
    links.map((l) =>
      el("a", { href: l.url, target: "_blank", rel: "noreferrer" }, [l.label])
    )
  );
}

export async function fetchList(kind) {
  const lang = detectLang();
  const api = supabase();

  if (kind === "work") {
    return api.get(
      `work_items?select=slug,title,summary,year,stack,links,featured&lang=eq.${lang}&published=eq.true&order=year.desc`
    );
  }
  if (kind === "blog") {
    return api.get(
      `blog_posts?select=slug,title,summary,published_at,tags&lang=eq.${lang}&published=eq.true&order=published_at.desc`
    );
  }
  if (kind === "art") {
    return api.get(
      `art_items?select=slug,title,year,medium,tags&lang=eq.${lang}&published=eq.true&order=year.desc`
    );
  }
  if (kind === "books") {
    return api.get(
      `books?select=slug,title,author,finished_at,rating,tags&lang=eq.${lang}&published=eq.true&order=finished_at.desc`
    );
  }
  throw new Error("Unknown kind");
}

export async function fetchOne(kind, slug) {
  const lang = detectLang();
  const api = supabase();

  const table =
    kind === "work"
      ? "work_items"
      : kind === "blog"
      ? "blog_posts"
      : kind === "art"
      ? "art_items"
      : kind === "books"
      ? "books"
      : null;

  if (!table) throw new Error("Unknown kind");

  const rows = await api.get(
    `${table}?select=*&lang=eq.${lang}&slug=eq.${encodeURIComponent(
      slug
    )}&limit=1`
  );
  return rows[0] || null;
}
