import fs from "node:fs";
import path from "node:path";

const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://nomuman.github.io";
const DIST_DIR = "dist";

const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, "utf8");
};

const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const locales = {
  en: JSON.parse(read("locales/en.json")),
  ja: JSON.parse(read("locales/ja.json")),
};

const navTpl = read("src/templates/partials/nav.html");
const navBackTpl = read("src/templates/partials/nav-back.html");
const footerTpl = read("src/templates/partials/footer.html");

const pages = [
  { src: "src/pages/index.html", path: "/", nav: "main" },
  { src: "src/pages/work/index.html", path: "/work/", nav: "main" },
  { src: "src/pages/work/item/index.html", path: "/work/item/", nav: "back", backPath: "/work/" },
  { src: "src/pages/blog/index.html", path: "/blog/", nav: "main" },
  { src: "src/pages/blog/post/index.html", path: "/blog/post/", nav: "back", backPath: "/blog/" },
  { src: "src/pages/art/index.html", path: "/art/", nav: "main" },
  { src: "src/pages/art/item/index.html", path: "/art/item/", nav: "back", backPath: "/art/" },
  { src: "src/pages/books/index.html", path: "/books/", nav: "main" },
  { src: "src/pages/colophon/index.html", path: "/colophon/", nav: "main" },
  { src: "src/pages/writing/index.html", path: "/writing/", nav: "main" },
  { src: "src/pages/featured/index.html", path: "/featured/", nav: "main" },
  { src: "src/pages/talks/index.html", path: "/talks/", nav: "main" },
  { src: "src/pages/404.html", path: "/404.html", nav: "none" },
];

const render = (template, dict, vars) => {
  let out = template;
  out = out.replace(/{{t:([^}]+)}}/g, (_, key) => {
    const k = key.trim();
    return dict[k] ?? `[[${k}]]`;
  });
  out = out.replace(/{{([^}]+)}}/g, (_, key) => {
    const k = key.trim();
    return vars[k] ?? `[[${k}]]`;
  });
  return out;
};

const joinOrigin = (origin, pagePath) => {
  const cleanedOrigin = origin.replace(/\/$/, "");
  const cleanedPath = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  return `${cleanedOrigin}${cleanedPath}`;
};

const outPathFor = (lang, pagePath) => {
  const baseDir = lang === "en" ? DIST_DIR : path.join(DIST_DIR, "ja");
  if (pagePath.endsWith(".html")) {
    const clean = pagePath.replace(/^\/+/, "");
    const dir = path.dirname(clean);
    const file = path.basename(clean);
    const outDir = dir === "." ? baseDir : path.join(baseDir, dir);
    return path.join(outDir, file);
  }
  const clean = pagePath === "/" ? "" : pagePath.replace(/^\/+|\/+$/g, "");
  const outDir = clean ? path.join(baseDir, clean) : baseDir;
  return path.join(outDir, "index.html");
};

const renderNav = (page, dict, vars) => {
  if (page.nav === "none") return "";
  if (page.nav === "back") {
    return render(navBackTpl, dict, {
      ...vars,
      backHref: `${vars.base}${page.backPath}`,
    });
  }
  return render(navTpl, dict, vars);
};

const renderFooter = (dict, vars) => render(footerTpl, dict, vars);

for (const lang of ["en", "ja"]) {
  const base = lang === "en" ? "" : "/ja";
  const altBase = lang === "en" ? "/ja" : "";
  const altLabel = lang === "en" ? "JA" : "EN";
  const dict = locales[lang];

  for (const page of pages) {
    const pagePath = page.path;
    const hrefEn = joinOrigin(SITE_ORIGIN, pagePath);
    const hrefJa = joinOrigin(SITE_ORIGIN, `/ja${pagePath}`);
    const ogUrl = lang === "en" ? hrefEn : hrefJa;
    const altHref = `${altBase}${pagePath}`;

    const vars = {
      lang,
      base,
      altLabel,
      altHref,
      hrefEn,
      hrefJa,
      ogUrl,
      ogImage: joinOrigin(SITE_ORIGIN, "/assets/ogp.png"),
    };

    const template = read(page.src);
    const nav = renderNav(page, dict, vars);
    const footer = renderFooter(dict, { base });
    const html = render(template, dict, { ...vars, nav, footer });

    write(outPathFor(lang, pagePath), html);
  }
}

copyDir("assets", path.join(DIST_DIR, "assets"));
copyDir("shared", path.join(DIST_DIR, "shared"));
