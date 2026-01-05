# Personal Website（EN/JA）設計 + 実装方針 + UIデザイン指針（Marjo Ballabani 風 / Neo-Brutalism）

担当：ジュニアエンジニア向け  
ホスティング：GitHub Pages（User site）  
データ：Supabase（Postgres + REST API + Storage）  
技術：Pure HTML / Pure CSS / Vanilla JS

> 注意：参考サイト（marjoballabani.me）の**“丸コピー”はしない**。  
> ここでは「情報設計・コンポーネント構造・雰囲気（neo-brutalism）」を参考にして、**中身と実装はオリジナルで再構築**する。

---

## 1. ゴール / 非ゴール

### ゴール

- ENを基本言語として `/` に配置、JAは `/ja/`
- コンテンツ領域
  - Work（アプリ/サイトなど制作物）
  - Blog（翻訳セット：EN/JAが同一slugで対応）
  - Art（自作イラストギャラリー）
  - Books（読書ログ）
  - About/Resume（経歴・スキル・連絡先）
- GitHub Pagesで静的配信（HTML/CSS/JSをそのまま配信できる）
- Supabaseにデータを格納し、フロントはRESTで読み出す（超軽量）  
  Supabase RESTは PostgREST を使い `/rest/v1/` で自動生成される
- 公開サイトなので読み取り中心。書き込みは最初はSupabase Dashboardで手作業。

### 非ゴール（今回はやらない）

- Terminal Resume（将来拡張。参考サイトはテーマ/言語/分割UIを持つ）
- ルーティングやSPA化（静的ページ + 必要ページだけfetch）
- 認証付き管理画面（必要になったらEdge Functions等で追加）

---

## 2. UIデザイン指針（参考：marjoballabani.me）

参考サイトのUI構造（要点）：

- 1ページ縦スクロール + 上部ナビ（Home/About/Journey/Skills/Contact）
- Hero：挨拶 → 大きいH1 → 1段落説明 → SNSリンク → CTAボタン（Get in Touch）
- セクション構成：ABOUT / My Journey（タイムライン） / SKILLS（カテゴリ+チップ）/ EDUCATION / LANGUAGES / GET IN TOUCH
- “Neo-Brutalism”っぽい要素：太い枠線・強いコントラスト・ベタ塗り・影・チップの羅列（タイポと余白で勝つ）

### このプロジェクトのUIルール（実装者向け）

**全体**

- 背景：ほぼ黒（#0b0b0d系）
- 文字：ほぼ白（#f5f5f7系）
- アクセント：1色だけ（蛍光グリーン/イエローなど）
- カード：太いborder + “ズレ影”（box-shadowで表現）
- フォント：システムフォント（外部フォント無し）

**コンポーネント**

- `TopNav`：左にロゴ（1文字）+ 右にリンク + CTAボタン（枠+影+アクセント背景）
- `SectionCard`：共通枠（border/背景/影/余白）
- `Chip`：スキル/タグ用。border + 太字
- `Timeline`：職歴や制作履歴（年/月・会社/プロジェクト・説明・場所）
- `GalleryGrid`：Art用。サムネは正方形寄せ（CSSで `object-fit: cover`）
- `BookList`：Books用。タイトル/著者/読了日/評価/一言（一覧で完結）

**アクセシビリティ**

- コントラスト確保、リンクhover、フォーカスリングを消さない
- 画像は `alt` 必須（Artは特に）

---

## 3. 情報設計（サイトマップ）

EN（ルート）：

- `/` Home
- `/work/` Work一覧
- `/work/<slug>/` Work詳細
- `/blog/` Blog一覧
- `/blog/<slug>/` Blog詳細（EN）
- `/art/` Art一覧
- `/art/<slug>/` Art詳細
- `/books/` Books一覧
- `/about/` About/Resume
- `/colophon/` Colophon（技術/軽量ポリシー）
- `/404.html`

JA：

- `/ja/` Home
- `/ja/work/` …（同構造）
- `/ja/blog/<slug>/` Blog詳細（JA）
- `/ja/art/` …
- `/ja/books/` …
- `/ja/about/` …
- `/ja/colophon/` …
- `/ja/404.html`

---

## 4. i18n（EN/JA翻訳セット）方針

- **言語ごとに別URL**を採用（Google推奨）
- すべての対応ページで `hreflang` を相互参照
  - `hreflang` は「ローカライズ版の対応関係」をGoogleに伝える
  - 各言語ページは **自分自身 + 相手言語** をheadに列挙（双方向じゃないと無視されうる）
- Googleは `hreflang` や `lang` 属性だけで言語判定はしない（ただし設定は重要）
- `<html lang="en">` / `<html lang="ja">` を必ず設定

**テンプレ（EN記事ページのhead）**

```html
<link rel="alternate" hreflang="en" href="https://nomuman.github.io/blog/<slug>/" />
<link rel="alternate" hreflang="ja" href="https://nomuman.github.io/ja/blog/<slug>/" />
```

---

## 5. データ設計（Supabase）

### 5.1 重要ルール（公開サイト）

- ブラウザからSupabaseに直接アクセスするなら **RLS（Row Level Security）を必ず有効化**([Supabase][1])
- 公開読み取りは `anon`（公開キー）でOK。ただし **RLSポリシーでSELECTだけ許可**する
  Supabaseは「ブラウザから安全にアクセスするにはRLSが必要」と明記([Supabase][1])
- Supabase RESTは `/rest/v1/` で提供される([Supabase][2])

### 5.2 テーブル（最小構成）

共通カラム（推奨）：

- `id uuid primary key default gen_random_uuid()`
- `group_id text not null`（翻訳セットの束ね）
- `lang text not null`（'en' or 'ja'）
- `slug text not null`
- `published boolean not null default false`
- `published_at timestamptz`（Blog/Workの並び替え用）
- `updated_at timestamptz default now()`

#### Work

`work_items`

- `title text`
- `summary text`
- `year int`
- `stack text[]`
- `links jsonb`（`[{label,url}]`）
- `body_html text`（詳細本文はHTMLで保持＝フロントが軽い）

#### Blog（翻訳セット）

`blog_posts`

- `title text`
- `summary text`
- `tags text[]`
- `body_html text`

#### Art

`art_items`

- `title text`
- `year int`
- `medium text`
- `tags text[]`
- `body_html text`

`art_images`

- `art_id uuid references art_items(id)`
- `sort int`
- `storage_path text`
- `thumb_path text`
- `alt text`
- `width int`
- `height int`

#### Books

`books`

- `title text`
- `author text`
- `finished_at date`
- `rating int`（1〜5）
- `tags text[]`
- `note_html text`

### 5.3 制約/Index（推奨）

- `unique(lang, slug)`（各テーブル）
- `index(published, published_at desc)`
- RLSが条件列を参照する場合、必要に応じてindex（RLSのbest practice）([Supabase][3])

---

## 6. セキュリティ（RLS/ポリシー）

- 全テーブル：RLS enable
- ポリシー：公開は `for select` のみ
  Supabaseの例でも `create policy ... on <table> for select using (...)` 形式で説明されている([Supabase][1])

**公開読み取り（例：publishedのみ見せる）**

```sql
alter table public.work_items enable row level security;

create policy "public read work_items"
on public.work_items
for select
using (published = true);
```

同様に `blog_posts / art_items / books` にも `published = true` を基本で付ける（未公開下書きを守る）。

---

## 7. APIアクセス（フロント：超軽量REST fetch）

Supabase RESTは PostgREST の薄い層で、DBスキーマから自動生成される([Supabase][2])
エンドポイント：`https://<project_ref>.supabase.co/rest/v1/<table>` ([Supabase][2])

ヘッダ：`apikey` と `Authorization: Bearer` が必要（Supabaseの例でも同パターン）([GitHub][4])

**共有関数（shared/supabase.js）**

```js
export function createSupabaseClient({ url, anonKey }) {
  async function get(path) {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  return { get };
}
```

**クエリ例**

- Work一覧（EN）
  - `work_items?select=slug,title,summary,year,stack,links&lang=eq.en&published=eq.true&order=year.desc`

- Blog一覧（EN）
  - `blog_posts?select=slug,title,summary,published_at,tags&lang=eq.en&published=eq.true&order=published_at.desc`

- 作品詳細（slug指定）
  - `work_items?select=*&lang=eq.en&slug=eq.<slug>&limit=1`

---

## 8. フロント実装方針（Pure HTML/CSS/JS）

### 8.1 重要方針：Progressive Enhancement

- JSが無くてもページ構造は読める（最低限のHTMLを置く）
- JSは「データ読み込み」「フィルタ」「UIの小改善」だけ

### 8.2 ページ戦略（静的 + 必要ページだけfetch）

- Home：Featured Work / Latest Blog / Latest Art / Latest Books を数件だけfetchして描画
- 一覧ページ：そのカテゴリの一覧をfetchしてカード化
- 詳細ページ：slugをURLから読んで対象データをfetchし、`body_html` を流し込む
  - `body_html` の挿入はXSSリスクがあるので、**信頼できる自分のデータのみ**に限定（public投稿機能を作らない限りOK）

### 8.3 リポジトリ構成（提案）

```
/
  index.html
  work/index.html
  work/item/index.html        # 詳細テンプレ（slugで切替 or JS生成）
  blog/index.html
  blog/post/index.html
  art/index.html
  art/item/index.html
  books/index.html
  about/index.html
  colophon/index.html
  404.html

  ja/...(同構造)

  shared/
    styles.css
    app.js
    supabase.js
    config.js                 # SUPABASE_URL, ANON_KEY（公開OK）

  assets/
    icons/
```

> 詳細ページを「slugごとに静的生成」もできるが、まずは **1テンプレ + JSでslug切替**が工数最小。

---

## 9. UI実装詳細（CSS設計）

### 9.1 CSSトークン（例）

- `--bg`, `--fg`, `--muted`, `--card`, `--border`, `--accent`, `--shadow`
- 影は1種類だけに固定（統一感）

### 9.2 レイアウト

- 最大幅 `960px`
- セクションはすべて `SectionCard` を使う（見た目の統一）

### 9.3 参考サイト風のセクション割

Homeに「まとめ版」を置き、詳細は各ページへ：

- Hero（Hi there! / 大見出し / 1段落 / SNS / CTA）([Marjo Ballabani][5])
- About（短め）
- Journey（タイムライン：職歴 or 主要プロジェクト）
- Skills（カテゴリ + chips）([Marjo Ballabani][5])
- Featured: Work / Art / Books / Blog（各3件だけ）
- Get in touch（Email/X/GitHub）

---

## 10. パフォーマンス予算（必須）

- 外部フォント無し
- 画像は当面使わない（使うならArtサムネのみ）
- JSは1〜2ファイル、合計20KB台を目標（minify前提ではないが意識）
- “初回に全部fetchしない”：Homeは各カテゴリ3件まで

---

## 11. 実装ステップ（ジュニア向け ToDo）

### Phase 0：設定値の準備

1. Supabaseプロジェクト作成
2. テーブル作成（Work/Blog/Art/Books + art_images）
3. 全テーブルRLS ON([Supabase][1])
4. `published = true` の SELECTポリシー作成（SQLで）([Supabase][1])
5. `SUPABASE_URL` と `ANON_KEY` を控える（APIキーの概念）([Supabase][6])

### Phase 1：静的ページ骨格（ENのみ）

- `index.html` と `shared/styles.css` と `shared/app.js` を作る
- ナビとセクションの“見た目”だけ先に完成（データ無しのダミーでOK）
- GitHub Pagesで表示確認（GitHub Pagesは静的HTML/CSS/JSをそのまま配信できる）([GitHub Docs][7])

### Phase 2：Supabase fetchで一覧表示

- `shared/config.js` と `shared/supabase.js` を作る
- `work/index.html` で Work一覧をfetchしてカード表示
- `blog/index.html` で Blog一覧をfetchしてカード表示
- `books/index.html` で Books一覧をfetchしてリスト表示
- `art/index.html` で Art一覧をfetchしてギャラリー表示（画像は後回し可）

### Phase 3：詳細ページ（テンプレ + slug）

- `work/item/` `blog/post/` `art/item/` にテンプレを作る
- URLクエリ or パスから `slug` を取り、対象データをfetch
- `hreflang` と `lang` を全ページに入れる（EN/JA対応に備える）([Google for Developers][8])

### Phase 4：JA追加（翻訳セット）

- ENページをコピーして `/ja/` 配下に配置
- 各ページの `hreflang` を双方向に設定([Google for Developers][8])
- データは `lang=eq.ja` で取得する

### Phase 5：磨き込み

- 404作成
- Colophonに「軽量ポリシー」「Supabase構成」「デザイン指針」を書く
- パフォーマンスチェック（不要JS/不要画像を削る）

---

## 12. 受け入れ条件（Doneの定義）

- `/`（EN）でHomeが表示される
- `/ja/`（JA）でHomeが表示される
- Work/Blog/Art/Books の一覧が表示される（Supabaseから取得）
- WorkとBlogとArtの詳細が表示される（slugで取得）
- すべての対応ページで `hreflang` が双方向に設定されている([Google for Developers][8])
- RLSが有効で、未publishedデータはanonでは取得できない([Supabase][1])
- Lighthouseで重大なSEO/アクセシビリティ警告がない（最低限）

---

## 13. 将来拡張（Terminal Resume）

参考サイトのTerminalは、テーマ選択・言語選択・分割表示などがある([Marjo Ballabani][9])
このプロジェクトでは後回し。追加するときは `/terminal/` を新設し、データは同じSupabaseを参照する。

[1]: https://supabase.com/docs/guides/database/postgres/row-level-security "Row Level Security | Supabase Docs"
[2]: https://supabase.com/docs/guides/api "REST API | Supabase Docs"
[3]: https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv?utm_source=chatgpt.com "RLS Performance and Best Practices"
[4]: https://github.com/orgs/supabase/discussions/19519?utm_source=chatgpt.com "Can't use REST endpoints · supabase · Discussion #19519"
[5]: https://marjoballabani.me/ "Marjo Ballabani | Senior Software Engineer | Full-Stack & Cloud Expert"
[6]: https://supabase.com/docs/guides/api/api-keys?utm_source=chatgpt.com "Understanding API keys | Supabase Docs"
[7]: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages?utm_source=chatgpt.com "What is GitHub Pages?"
[8]: https://developers.google.com/search/docs/specialty/international/localized-versions "Localized Versions of your Pages | Google Search Central  |  Documentation  |  Google for Developers"
[9]: https://marjoballabani.me/terminal.html "Marjo Ballabani | Terminal Resume"
