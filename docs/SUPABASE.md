# Personal Website（EN/JA）Supabase セットアップ手順 + DDL + RLS + Seed

## 1) Supabase セットアップ手順（ジュニア向け）

1. Supabase プロジェクト作成
2. **SQL Editor** を開く
3. 下の **DDL** をそのまま実行（テーブル作成）
4. 下の **RLS + Policies** を実行（公開読み取り）

   * RLSをONにすると、anonではアクセス不可になり、ポリシーが必要。 ([Supabase][2])
5. 下の **Seed（サンプルデータ）** を実行（動作確認用）
6. Supabase から `Project URL` と `anon key` を取得（キーの種類は公式参照） ([Supabase][5])
7. GitHub Pages 側の `shared/config.js` に設定（あなたのテンプレ通り）

---

## 2) DDL（テーブル作成SQL）

> そのままコピペでOK（publicスキーマ想定）

```sql
-- 必要ならUUID生成用（Supabaseでは多くの環境で既に有効）
-- create extension if not exists "pgcrypto";

-- 共通：更新日時を自動更新したい場合のtrigger（任意）
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================
-- WORK
-- =========================
create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  group_id text not null,
  lang text not null check (lang in ('en','ja')),
  slug text not null,
  title text not null,
  summary text,
  year int,
  stack text[] default '{}',
  links jsonb default '[]'::jsonb,
  body_html text,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (lang, slug)
);

create index if not exists work_items_published_idx
  on public.work_items (published, year desc);

create trigger trg_work_items_updated_at
before update on public.work_items
for each row execute function public.set_updated_at();


-- =========================
-- BLOG
-- =========================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  group_id text not null,
  lang text not null check (lang in ('en','ja')),
  slug text not null,
  title text not null,
  summary text,
  tags text[] default '{}',
  body_html text,
  published boolean not null default false,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (lang, slug)
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc);

create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();


-- =========================
-- ART
-- =========================
create table if not exists public.art_items (
  id uuid primary key default gen_random_uuid(),
  group_id text not null,
  lang text not null check (lang in ('en','ja')),
  slug text not null,
  title text not null,
  year int,
  medium text,
  tags text[] default '{}',
  body_html text,
  published boolean not null default false,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (lang, slug)
);

create index if not exists art_items_published_idx
  on public.art_items (published, year desc);

create trigger trg_art_items_updated_at
before update on public.art_items
for each row execute function public.set_updated_at();


-- 画像はStorageに置いて、DBにはパス/メタを持つ
create table if not exists public.art_images (
  id uuid primary key default gen_random_uuid(),
  art_id uuid not null references public.art_items(id) on delete cascade,
  sort int not null default 0,
  storage_path text not null,
  thumb_path text,
  alt text,
  width int,
  height int,
  created_at timestamptz not null default now()
);

create index if not exists art_images_art_id_sort_idx
  on public.art_images (art_id, sort asc);


-- =========================
-- BOOKS
-- =========================
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  group_id text not null,
  lang text not null check (lang in ('en','ja')),
  slug text not null,
  title text not null,
  author text,
  finished_at date,
  rating int check (rating between 1 and 5),
  tags text[] default '{}',
  note_html text,
  published boolean not null default false,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (lang, slug)
);

create index if not exists books_published_idx
  on public.books (published, finished_at desc);

create trigger trg_books_updated_at
before update on public.books
for each row execute function public.set_updated_at();
```

---

## 3) RLS ON + 公開読み取りポリシー（必須）

RLSをONにすると、**anon key では何も見えなくなる**ので、公開したい分だけ `SELECT` ポリシーを作る。 ([Supabase][2])
ポリシーは `for select using (...)` の形。 ([Supabase][2])

```sql
-- WORK
alter table public.work_items enable row level security;
create policy "public read work_items"
on public.work_items
for select
using (published = true);

-- BLOG
alter table public.blog_posts enable row level security;
create policy "public read blog_posts"
on public.blog_posts
for select
using (published = true);

-- ART
alter table public.art_items enable row level security;
create policy "public read art_items"
on public.art_items
for select
using (published = true);

alter table public.art_images enable row level security;
create policy "public read art_images"
on public.art_images
for select
using (true);

-- BOOKS
alter table public.books enable row level security;
create policy "public read books"
on public.books
for select
using (published = true);
```

> `art_images` は `art_items` の公開/非公開と連動させたいなら、後で `using (exists (...))` に強化できる（まずは簡単に動かす優先）。

---

## 4) Seed（サンプルデータ）

```sql
-- WORK（EN/JA 翻訳セット）
insert into public.work_items
(group_id, lang, slug, title, summary, year, stack, links, body_html, featured, published, published_at)
values
('work_kyu','en','kyu','KYU','Memory capture app + camera ecosystem',2025,
 array['Flutter','Kotlin','Firebase'],
 '[{"label":"GitHub","url":"https://github.com/your_github"},{"label":"Site","url":"https://example.com"}]'::jsonb,
 '<p>Short case study (EN).</p><ul><li>What I built</li><li>Constraints</li><li>Impact</li></ul>',
 true, true, now()),
('work_kyu','ja','kyu','KYU','思い出を残すアプリ＋カメラのエコシステム',2025,
 array['Flutter','Kotlin','Firebase'],
 '[{"label":"GitHub","url":"https://github.com/your_github"},{"label":"Site","url":"https://example.com"}]'::jsonb,
 '<p>短いケーススタディ（JA）。</p><ul><li>作ったもの</li><li>制約</li><li>成果</li></ul>',
 true, true, now());

-- BLOG
insert into public.blog_posts
(group_id, lang, slug, title, summary, tags, body_html, published, published_at)
values
('post_hello_2026','en','hello-2026','Hello 2026','Notes on what I want to build in 2026.',
 array['career','product'],
 '<p>Blog post body (EN).</p>',
 true, now()),
('post_hello_2026','ja','hello-2026','2026のはじめに','2026年に作りたいものについてのメモ。',
 array['career','product'],
 '<p>ブログ本文（JA）。</p>',
 true, now());

-- ART
insert into public.art_items
(group_id, lang, slug, title, year, medium, tags, body_html, published, published_at)
values
('art_morning_study','en','morning-study','Morning Study',2025,'Digital',array['study','character'],
 '<p>Small note about this piece (EN).</p>', true, now()),
('art_morning_study','ja','morning-study','朝の習作',2025,'Digital',array['study','character'],
 '<p>この作品についてのメモ（JA）。</p>', true, now());

-- BOOKS
insert into public.books
(group_id, lang, slug, title, author, finished_at, rating, tags, note_html, published, published_at)
values
('book_clean_arch','en','clean-architecture','Clean Architecture','Robert C. Martin','2025-12-20',4,
 array['software','architecture'],
 '<p>Key takeaways (EN).</p>', true, now()),
('book_clean_arch','ja','clean-architecture','Clean Architecture','Robert C. Martin','2025-12-20',4,
 array['software','architecture'],
 '<p>学びメモ（JA）。</p>', true, now());
```

---

## 5) REST 動作確認（curl）

SupabaseのRESTは `/rest/v1`。ヘッダに `apikey` と `Authorization: Bearer` を付けるのが一般的。 ([apidog][3])

```bash
export SUPABASE_URL="https://<project_ref>.supabase.co"
export SUPABASE_ANON_KEY="<anon_key>"

curl -s \
  "${SUPABASE_URL}/rest/v1/work_items?select=slug,title,year&lang=eq.en&published=eq.true" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

---

## 6) GitHub Pages 側の作業（最小）

1. `shared/config.js` の `<username>` / `<project_ref>` / `<anon_key>` を埋める
2. push
3. `https://<username>.github.io/` を開いて、Featured が出れば成功
   （User site リポジトリは `username.github.io` で作るのが公式Quickstart） ([GitHub Docs][1])

---

## 7) 最後に：hreflang の最低ライン

Googleは「hreflangはローカライズ版の対応関係を伝える」ための仕組みで、言語判定自体には使わないと明記してる。 ([Google for Developers][4])
また、hreflangは絶対URL推奨（エラーに敏感）。 ([Google Help][6])

**ENページ例（/work/）**

```html
<link rel="alternate" hreflang="en" href="https://<username>.github.io/work/" />
<link rel="alternate" hreflang="ja" href="https://<username>.github.io/ja/work/" />
```

---

この状態まで行けば、**UIは既にMarjo風で表示**できて、**データもSupabaseから出る**はず。
次にやるなら「Art画像（Supabase Storage）をどう置くか」だけど、まずはこのDB + RLS + Seedで動作確認まで進めよう。

[1]: https://docs.github.com/en/pages/quickstart?utm_source=chatgpt.com "Quickstart for GitHub Pages"
[2]: https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com "Row Level Security | Supabase Docs"
[3]: https://apidog.com/jp/blog/supabase-api-jp/?utm_source=chatgpt.com "Supabase APIの実践テクニック：バックエンド構築の最短ルート"
[4]: https://developers.google.com/search/docs/specialty/international/localized-versions?utm_source=chatgpt.com "Localized Versions of your Pages | Google Search Central"
[5]: https://supabase.com/docs/guides/api/api-keys?utm_source=chatgpt.com "Understanding API keys | Supabase Docs"
[6]: https://support.google.com/webmasters/thread/38750715/do-hreflang-need-to-have-absolute-urls?hl=en&utm_source=chatgpt.com "Do hreflang need to have absolute URLs?"
