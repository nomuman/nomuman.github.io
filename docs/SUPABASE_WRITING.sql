-- Writing / Featured / Talks for Supabase
-- Run after docs/SUPABASE.md (requires public.set_updated_at() if you want triggers)

-- =========================
-- WRITING ITEMS
-- =========================
create table if not exists public.writing_items (
  id uuid primary key default gen_random_uuid(),
  group_id text not null,
  lang text not null check (lang in ('en','ja')),
  content_lang text not null check (content_lang in ('en','ja')),
  slug text not null,
  kind text not null check (kind in ('writing','featured','talk')),
  title text not null,
  summary text,
  outlet text,
  type text,
  role text,
  url text not null,
  tags text[] default '{}',
  published boolean not null default false,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (lang, slug)
);

create index if not exists writing_items_kind_lang_idx
  on public.writing_items (kind, lang, published_at desc);

create index if not exists writing_items_published_idx
  on public.writing_items (published, published_at desc);

create trigger trg_writing_items_updated_at
before update on public.writing_items
for each row execute function public.set_updated_at();

-- =========================
-- RLS + POLICY
-- =========================
alter table public.writing_items enable row level security;
create policy "public read writing_items"
on public.writing_items
for select
using (published = true);

-- =========================
-- SEED DATA
-- =========================
insert into public.writing_items
(group_id, lang, content_lang, slug, kind, title, summary, outlet, type, role, url, tags, published, published_at)
values
-- Writing: Future Tech Blog (Flutter/Proxy)
('writing_flutter_proxy','en','ja','flutter-proxy','writing',
 'Proxying Android Emulator traffic in a corporate network (Flutter)',
 'How to route Flutter/Android emulator traffic through a proxy in a corporate network.',
 'Future Tech Blog', null, null,
 'https://future-architect.github.io/articles/20231026a/',
 array['Engineering','Flutter'],
 true, '2023-10-26'),
('writing_flutter_proxy','ja','ja','flutter-proxy','writing',
 '【Flutter】Proxyがある社内ネットワーク環境でAndroidエミュレータからインターネットに接続する方法',
 '社内プロキシ環境でFlutter/Androidエミュレータを通信させる方法の解説。',
 'フューチャー技術ブログ', null, null,
 'https://future-architect.github.io/articles/20231026a/',
 array['Engineering','Flutter'],
 true, '2023-10-26'),

-- Writing: note personal essay
('writing_programming_essay','en','ja','programming-essay','writing',
 'Finding the joy of programming',
 'A personal essay on discovering the joy of programming and the craft behind it.',
 'note (Miraiho)', null, null,
 'https://note.future.co.jp/n/nc143de35d13d',
 array['Essay','Personal'],
 true, null),
('writing_programming_essay','ja','ja','programming-essay','writing',
 'プログラミングの面白さに気づいたビジネスパーソンの卵へ',
 'プログラミングの面白さに気づいた体験を綴ったエッセイ。',
 '未来報（note）', null, null,
 'https://note.future.co.jp/n/nc143de35d13d',
 array['Essay','Personal'],
 true, null),

-- Featured: FIBP program
('featured_fibp','en','ja','fibp-program','featured',
 'Future Business Innovation Program (FIBP)',
 'Mentioned as a participant; useful external context for related work.',
 'note (Miraiho)', 'Program', null,
 'https://note.future.co.jp/n/ndd2493c4541d',
 array['Press','Program'],
 true, null),
('featured_fibp','ja','ja','fibp-program','featured',
 'フューチャーの新規事業創造プログラム（FIBP）のご紹介',
 '参加者として登場する紹介記事。プログラムの説明と活動文脈の補足。',
 '未来報（note）', 'Program', null,
 'https://note.future.co.jp/n/ndd2493c4541d',
 array['Press','Program'],
 true, null),

-- Featured: Yumemi case study
('featured_yumemi','en','ja','hobonichi-techo-case-study','featured',
 'Hobonichi Techo App — Case Study',
 'External case study page; a public reference for the project.',
 'YUMEMI', 'Case Study', null,
 'https://www.yumemi.co.jp/hobonichi_techoapp',
 array['Press','Case Study'],
 true, null),
('featured_yumemi','ja','ja','hobonichi-techo-case-study','featured',
 'ほぼ日手帳アプリ 事例ページ',
 '外部の制作事例ページ。実績の裏取りリンクとして掲載。',
 'YUMEMI', 'Case Study', null,
 'https://www.yumemi.co.jp/hobonichi_techoapp',
 array['Press','Case Study'],
 true, null),

-- Talks / Demos: WISS 2025
('talks_wiss_2025','en','ja','wiss-2025-demo','talk',
 'WISS 2025 — Demo Program',
 'Demo program listing for WISS 2025. Additional proof links can be added later.',
 'WISS', 'Demo', 'Exhibitor',
 'https://www.wiss.org/WISS2025/demo.html',
 array['Talks','Demo'],
 true, '2025-01-01'),
('talks_wiss_2025','ja','ja','wiss-2025-demo','talk',
 'WISS 2025 デモ発表プログラム',
 'WISS 2025 のデモ発表プログラム。後日、予稿集や追加リンクを追記可能。',
 'WISS', 'Demo', 'Exhibitor',
 'https://www.wiss.org/WISS2025/demo.html',
 array['Talks','Demo'],
 true, '2025-01-01');
