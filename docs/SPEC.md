# Personal Website（EN/JA）初期ファイル雛形一式

## 0) まず守るルール（ジュニア向け）

* **ENがルート `/`、JAは `/ja/`**
* **GitHub Pages は静的配信**（HTML/CSS/JSのみ） ([GitHub Docs][1])
* Supabaseはブラウザから読むので、**RLS ON + SELECTだけ許可**が必須 ([Supabase][3])
* `anon key` は公開前提のキー。**service_role は絶対に置かない** ([Supabase][4])
* `hreflang` は全対応ページで相互に設定（SEO/Lighthouse対策） ([Google for Developers][5])

---

## 1) フォルダ構成（そのまま作る）

```
/
  index.html
  404.html

  work/index.html
  work/item/index.html

  blog/index.html
  blog/post/index.html

  art/index.html
  art/item/index.html

  books/index.html
  about/index.html
  colophon/index.html

  ja/
    index.html
    404.html
    work/index.html
    work/item/index.html
    blog/index.html
    blog/post/index.html
    art/index.html
    art/item/index.html
    books/index.html
    about/index.html
    colophon/index.html

  shared/
    styles.css
    config.js
    supabase.js
    app.js
```

> 詳細ページURLは最初は **クエリ方式**にする（例：`/work/item/?slug=kyu`）。
> `/work/kyu/` みたいな“きれいなURL”は、後で静的生成 or リライト導入でやる。

---

## 2) Supabase 側の前提（超重要）

* REST API は `https://<project_ref>.supabase.co/rest/v1/` で使える ([Supabase][2])
* ブラウザから叩くので `apikey` と（通常）`Authorization: Bearer` を付ける ([Supabase][6])
* そして **RLS を enable、SELECT policy を using で書く** ([Supabase][3])

---

## 3) 共有ファイル（まずこれをコピペ）

### `shared/config.js`（※公開OKなのは anon key だけ）

```js
// 公開OK: anon key（publishable key）
// 絶対NG: service_role key
window.__APP_CONFIG__ = {
  SITE_ORIGIN: "https://<username>.github.io", // 後で置換
  SUPABASE_URL: "https://<project_ref>.supabase.co",
  SUPABASE_ANON_KEY: "<anon_key>",
};
```

### `shared/supabase.js`

```js
export function supabase() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.__APP_CONFIG__;

  async function get(tableAndQuery) {
    const url = `${SUPABASE_URL}/rest/v1/${tableAndQuery}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json();
  }

  return { get };
}
```

### `shared/app.js`（言語切替 + UIパーツ + ページ共通）

```js
import { supabase } from "./supabase.js";

export function detectLang() {
  return location.pathname.startsWith("/ja/") ? "ja" : "en";
}

export function buildAltLangUrl() {
  const isJa = location.pathname.startsWith("/ja/");
  if (isJa) return location.pathname.replace(/^\/ja\//, "/"); // ja -> en
  return `/ja${location.pathname}`; // en -> ja
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
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  for (const c of children) node.append(c);
  return node;
}

export function card(title, bodyNode) {
  return el("section", { class: "card" }, [
    el("h2", {}, [title]),
    bodyNode,
  ]);
}

export function chips(items = []) {
  return el("div", { class: "chips" }, items.map(t => el("span", {}, [t])));
}

export function linkRow(links = []) {
  return el("div", { class: "links" }, links.map(l =>
    el("a", { href: l.url, target: "_blank", rel: "noreferrer" }, [l.label])
  ));
}

export async function fetchList(kind) {
  // kind: work|blog|art|books
  const lang = detectLang();
  const api = supabase();

  if (kind === "work") {
    return api.get(
      `work_items?select=slug,title,summary,year,stack,links&lang=eq.${lang}&published=eq.true&order=year.desc`
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

  const table = kind === "work" ? "work_items"
    : kind === "blog" ? "blog_posts"
    : kind === "art" ? "art_items"
    : kind === "books" ? "books"
    : null;

  if (!table) throw new Error("Unknown kind");

  const rows = await api.get(`${table}?select=*&lang=eq.${lang}&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] || null;
}
```

### `shared/styles.css`（Marjo風 neo-brutal 最小セット）

```css
:root{
  --bg:#0b0b0d;
  --fg:#f5f5f7;
  --muted:#b8b8c2;
  --card:#111116;
  --border:#f5f5f7;
  --accent:#a3ff12;
  --shadow: 6px 6px 0 rgba(245,245,247,.9);
  --max: 960px;
}

*{ box-sizing:border-box; }
html{ scroll-behavior:smooth; }
body{
  margin:0;
  background:var(--bg);
  color:var(--fg);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
  line-height:1.5;
}

a{ color:var(--fg); }
a:focus{ outline:2px solid var(--accent); outline-offset:2px; }

.topbar{
  position:sticky; top:0; z-index:10;
  background:rgba(11,11,13,.85);
  backdrop-filter:saturate(140%) blur(6px);
  border-bottom:2px solid rgba(245,245,247,.2);
  display:flex; align-items:center; justify-content:space-between;
  padding:12px 16px;
}

.brand{
  display:inline-flex; align-items:center; justify-content:center;
  width:40px; height:40px;
  border:2px solid var(--border);
  box-shadow: var(--shadow);
  background:var(--card);
  text-decoration:none;
  font-weight:900;
}

.nav{ display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
.nav a{ text-decoration:none; opacity:.9; }
.nav a:hover{ opacity:1; text-decoration:underline; }

.nav .cta{
  padding:8px 10px;
  border:2px solid var(--border);
  box-shadow: var(--shadow);
  background:var(--accent);
  color:#000;
  font-weight:900;
}

.wrap{ max-width:var(--max); margin:0 auto; padding:28px 16px 48px; }

.hero{ padding:18px 0 22px; }
.kicker{ margin:0 0 8px; color:var(--muted); }
h1{ margin:0 0 12px; font-size:clamp(36px, 5vw, 64px); line-height:1.05; }
.lead{ max-width:62ch; color:var(--muted); font-size:1.1rem; }

.card{
  margin:18px 0;
  padding:18px;
  border:2px solid var(--border);
  background:var(--card);
  box-shadow: var(--shadow);
}
.card h2{ margin:0 0 12px; }

.links{ display:flex; gap:12px; flex-wrap:wrap; margin-top:10px; }
.links a{ border-bottom:2px solid rgba(245,245,247,.25); }
.links a:hover{ border-bottom-color:var(--accent); }

.chips{ display:flex; gap:8px; flex-wrap:wrap; }
.chips span{
  padding:6px 8px;
  border:2px solid rgba(245,245,247,.35);
  background:#0e0e13;
  font-weight:800;
}

.grid2{
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap:14px;
}
@media (max-width:720px){ .grid2{ grid-template-columns:1fr; } }

.list{ margin:0; padding:0; list-style:none; }
.item{
  padding:12px 0;
  border-top:1px solid rgba(245,245,247,.2);
}
.item:first-child{ border-top:0; }

.muted{ color:var(--muted); }

.footer{ margin-top:22px; color:var(--muted); }
```

---

## 4) 各ページ（EN/JA）テンプレ

> 全ページ共通で `<link rel="stylesheet" href="/shared/styles.css">` と `type="module"` を使う。
> `hreflang` は Google のガイド通り、各言語版すべてを列挙（最低でも en/ja を相互） ([Google for Developers][5])

### 4.1 `index.html`（EN Home）

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Natsume</title>
  <meta name="description" content="Portfolio, blog, art, and books." />

  <link rel="alternate" hreflang="en" href="https://<username>.github.io/" />
  <link rel="alternate" hreflang="ja" href="https://<username>.github.io/ja/" />

  <link rel="stylesheet" href="/shared/styles.css" />
  <script src="/shared/config.js"></script>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/" aria-label="Home">N</a>
    <nav class="nav">
      <a href="/work/">Work</a>
      <a href="/blog/">Blog</a>
      <a href="/art/">Art</a>
      <a href="/books/">Books</a>
      <a href="/about/">About</a>
      <a class="cta" href="mailto:you@example.com">Get in touch</a>
      <a data-lang-toggle href="/ja/">JA</a>
    </nav>
  </header>

  <main class="wrap">
    <section class="hero">
      <p class="kicker">Hi there!</p>
      <h1>I’m Natsume.</h1>
      <p class="lead">Software Engineer in Japan. I build mobile products and love lightweight craft.</p>

      <div class="links">
        <a href="mailto:you@example.com">Email</a>
        <a href="https://x.com/your_x" target="_blank" rel="noreferrer">X</a>
        <a href="https://github.com/your_github" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </section>

    <section class="card">
      <h2>Featured</h2>
      <div id="featured" class="grid2"></div>
      <p class="muted">Pulling latest items from Supabase.</p>
    </section>

    <footer class="footer">
      <small>© <span data-year></span> Natsume</small>
    </footer>
  </main>

  <script type="module">
    import { mountLangToggle, setYear, fetchList, el, chips } from "/shared/app.js";

    mountLangToggle();
    setYear();

    const featured = document.getElementById("featured");
    const work = await fetchList("work");
    const items = work.filter(x => x.featured).slice(0, 3);

    featured.replaceChildren(
      ...items.map(x => el("div", { class: "card" }, [
        el("h2", {}, [x.title]),
        el("p", { class: "muted" }, [x.summary || ""]),
        chips(x.stack || []),
        el("div", { class: "links" }, [
          el("a", { href: `/work/item/?slug=${encodeURIComponent(x.slug)}` }, ["Read"])
        ])
      ]))
    );
  </script>
</body>
</html>
```

### 4.2 `ja/index.html`（JA Home：EN版を翻訳 + パス修正）

```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Natsume</title>
  <meta name="description" content="ポートフォリオ、ブログ、アート、読書ログ。" />

  <link rel="alternate" hreflang="en" href="https://<username>.github.io/" />
  <link rel="alternate" hreflang="ja" href="https://<username>.github.io/ja/" />

  <link rel="stylesheet" href="/shared/styles.css" />
  <script src="/shared/config.js"></script>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/ja/" aria-label="Home">N</a>
    <nav class="nav">
      <a href="/ja/work/">Work</a>
      <a href="/ja/blog/">Blog</a>
      <a href="/ja/art/">Art</a>
      <a href="/ja/books/">Books</a>
      <a href="/ja/about/">About</a>
      <a class="cta" href="mailto:you@example.com">連絡する</a>
      <a data-lang-toggle href="/">EN</a>
    </nav>
  </header>

  <main class="wrap">
    <section class="hero">
      <p class="kicker">やあ！</p>
      <h1>Natsumeです。</h1>
      <p class="lead">日本でソフトウェアを作ってる。軽量で長く育つプロダクトが好き。</p>

      <div class="links">
        <a href="mailto:you@example.com">Email</a>
        <a href="https://x.com/your_x" target="_blank" rel="noreferrer">X</a>
        <a href="https://github.com/your_github" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </section>

    <section class="card">
      <h2>注目</h2>
      <div id="featured" class="grid2"></div>
    </section>

    <footer class="footer">
      <small>© <span data-year></span> Natsume</small>
    </footer>
  </main>

  <script type="module">
    import { mountLangToggle, setYear, fetchList, el, chips } from "/shared/app.js";
    mountLangToggle(); setYear();

    const featured = document.getElementById("featured");
    const work = await fetchList("work");
    const items = work.filter(x => x.featured).slice(0, 3);

    featured.replaceChildren(
      ...items.map(x => el("div", { class: "card" }, [
        el("h2", {}, [x.title]),
        el("p", { class: "muted" }, [x.summary || ""]),
        chips(x.stack || []),
        el("div", { class: "links" }, [
          el("a", { href: `/ja/work/item/?slug=${encodeURIComponent(x.slug)}` }, ["読む"])
        ])
      ]))
    );
  </script>
</body>
</html>
```

---

## 5) 一覧ページ＆詳細ページ（Work/Blog/Art/Books）

**一覧**は `fetchList(kind)` で描画。**詳細**は `?slug=` で `fetchOne(kind, slug)`。

### 5.1 `work/index.html`（EN）

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Work — Natsume</title>

  <link rel="alternate" hreflang="en" href="https://<username>.github.io/work/" />
  <link rel="alternate" hreflang="ja" href="https://<username>.github.io/ja/work/" />

  <link rel="stylesheet" href="/shared/styles.css" />
  <script src="/shared/config.js"></script>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">N</a>
    <nav class="nav">
      <a href="/work/">Work</a><a href="/blog/">Blog</a><a href="/art/">Art</a><a href="/books/">Books</a><a href="/about/">About</a>
      <a data-lang-toggle href="/ja/work/">JA</a>
    </nav>
  </header>

  <main class="wrap">
    <section class="card">
      <h2>Work</h2>
      <ul id="list" class="list"></ul>
    </section>
  </main>

  <script type="module">
    import { mountLangToggle, fetchList, el, chips } from "/shared/app.js";
    mountLangToggle();

    const ul = document.getElementById("list");
    const items = await fetchList("work");

    ul.replaceChildren(...items.map(x =>
      el("li", { class: "item" }, [
        el("h3", {}, [x.title]),
        el("p", { class: "muted" }, [x.summary || ""]),
        chips(x.stack || []),
        el("div", { class: "links" }, [
          el("a", { href: `/work/item/?slug=${encodeURIComponent(x.slug)}` }, ["Read"])
        ])
      ])
    ));
  </script>
</body>
</html>
```

### 5.2 `work/item/index.html`（EN 詳細）

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Work — Natsume</title>
  <link rel="stylesheet" href="/shared/styles.css" />
  <script src="/shared/config.js"></script>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/">N</a>
    <nav class="nav">
      <a href="/work/">Back</a>
      <a data-lang-toggle href="/ja/work/item/">JA</a>
    </nav>
  </header>

  <main class="wrap">
    <section class="card">
      <h2 id="title">Loading…</h2>
      <p id="summary" class="muted"></p>
      <div id="stack" class="chips"></div>
      <div id="links" class="links"></div>
      <hr style="border:0;border-top:1px solid rgba(245,245,247,.2);margin:16px 0;">
      <div id="body"></div>
    </section>
  </main>

  <script type="module">
    import { mountLangToggle, qs, fetchOne, chips, linkRow } from "/shared/app.js";
    mountLangToggle();

    const slug = qs("slug");
    if (!slug) {
      document.getElementById("title").textContent = "Missing slug";
      throw new Error("Missing slug");
    }

    const item = await fetchOne("work", slug);
    if (!item) {
      document.getElementById("title").textContent = "Not found";
      throw new Error("Not found");
    }

    document.title = `${item.title} — Work`;
    document.getElementById("title").textContent = item.title;
    document.getElementById("summary").textContent = item.summary || "";

    document.getElementById("stack").replaceWith(chips(item.stack || []));
    document.getElementById("links").replaceWith(linkRow(item.links || []));

    // body_html は “自分が管理するデータのみ” を前提（公開投稿は作らない）
    document.getElementById("body").innerHTML = item.body_html || "";
  </script>
</body>
</html>
```

### 5.3 JA版（`/ja/work/...`）は EN版をコピーしてリンクだけ `/ja/` に変える

* 一覧：`/ja/work/index.html` の `fetchList("work")` は自動で `lang=ja` になる（`detectLang()`）
* 詳細：`/ja/work/item/index.html` で `Back` を `/ja/work/` にするだけ

---

## 6) Blog / Art / Books も同じパターンで作る（最短）

* Blog一覧：`fetchList("blog")` → `/blog/post/?slug=...`
* Art一覧：`fetchList("art")` → `/art/item/?slug=...`
* Books一覧：`fetchList("books")`（Books詳細は最初は不要でもOK）

> Supabase REST はテーブルから自動でAPIが生えるから、同じテンプレで増やせる ([Supabase][2])

---

## 7) `404.html`（EN/JA）

GitHub Pages はカスタム 404 を置けるので、ルートと `/ja/` 両方に置く。 ([GitHub Docs][1])

### `404.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>404 — Not Found</title>
  <link rel="stylesheet" href="/shared/styles.css" />
</head>
<body>
  <main class="wrap">
    <section class="card">
      <h2>404</h2>
      <p class="muted">Page not found.</p>
      <div class="links"><a href="/">Go home</a></div>
    </section>
  </main>
</body>
</html>
```

---

## 8) Supabase RLS（必須の最小例）

RLSの `SELECT policy` は `using` で条件を書く（Supabase docs） ([Supabase][3])

例（`published = true` の行だけ公開）：

```sql
alter table public.work_items enable row level security;

create policy "public read work"
on public.work_items
for select
using (published = true);
```

同様に `blog_posts / art_items / books` も作る。

---

## 9) ジュニア向けチェックリスト（Doneの定義）

* [ ] `/` と `/ja/` が表示され、言語切替が動く
* [ ] `/work/` が Supabase から一覧取得できる
* [ ] `/work/item/?slug=...` が表示できる
* [ ] RLSが有効で、`published=false` は取得できない ([Supabase][3])
* [ ] `hreflang` をEN/JAの各対応ページに設定（Googleガイドに沿う） ([Google for Developers][5])


[1]: https://docs.github.com/en/pages/quickstart?utm_source=chatgpt.com "Quickstart for GitHub Pages"
[2]: https://supabase.com/docs/guides/api?utm_source=chatgpt.com "REST API | Supabase Docs"
[3]: https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com "Row Level Security | Supabase Docs"
[4]: https://supabase.com/docs/guides/api/api-keys?utm_source=chatgpt.com "Understanding API keys | Supabase Docs"
[5]: https://developers.google.com/search/docs/specialty/international/localized-versions?utm_source=chatgpt.com "Localized Versions of your Pages | Google Search Central"
[6]: https://supabase.com/docs/guides/api/creating-routes?utm_source=chatgpt.com "Creating API Routes | Supabase Docs"
