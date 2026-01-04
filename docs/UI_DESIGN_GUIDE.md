# UI_DESIGN_GUIDE.md
Personal Website UIデザイン指南書（Neo-Brutal Resume / “Marjo風の空気感”を参考に、オリジナルとして再構築）

## 0. このガイドの目的
- “Neo-brutalism” の **強い存在感**（太い枠線・強い影・高コントラスト・ブロック感）を採用しつつ、**コピーではなくオリジナル**として成立するUIを作る。
- ジュニアが実装で迷わないよう、**デザイン決定をルール化**する（MECE）。

参考観察（要点）：
- 上部ナビ（Home/About/Journey/Skills/Contact）＋Hero（挨拶→大見出し→説明→SNS→CTA） :contentReference[oaicite:1]{index=1}
- Journeyはタイムライン形式（職歴カードが連なる） :contentReference[oaicite:2]{index=2}
- Skillsはカテゴリごとに “単語チップを並べる” 表現 :contentReference[oaicite:3]{index=3}
- Footer付近に Terminal への導線 :contentReference[oaicite:4]{index=4}
- Awwwardsでも “neo brutalism style” と説明されている :contentReference[oaicite:5]{index=5}

> Neo-brutalismの特徴：高コントラスト、ブロック/ボクシー、太枠、ハードな影、未加工感 :contentReference[oaicite:6]{index=6}

---

## 1. デザイン原則（Principles）
### P1. コントラストで勝つ
- 背景は暗、文字は明（ただし真っ白/真っ黒に固定しない）
- アクセント色は原則1色（CTA・フォーカス・ハイライトのみに使用）

### P2. “枠” と “影” をUIの骨格にする
- 太いborder（例：2px or 3px）を基準に統一
- 影は“ずれ影”1種類に固定（例：`6px 6px 0`）
- 角丸は最小（0〜8px）。丸くしすぎない

### P3. 要素数を絞る（軽量 + Brutal）
- グラデーション/ブラー/複雑なアニメは基本なし
- 画像・アイコンは最小限（あっても数点）
- UIのリズムは「余白・見出しサイズ・区切り線」で作る

---

## 2. レイアウト設計（Layout）
### 2.1 ブレークポイント
- Mobile: 〜720px
- Desktop: 721px〜

### 2.2 コンテナ
- 最大幅：960px（±100は可）
- 左右padding：16px（モバイル） / 24px（デスクトップ）

### 2.3 ページ構成（共通）
- `Topbar`（sticky）
- `Main`（Hero → SectionCardの連続）
- `Footer`（軽いリンク/コピーライト）

### 2.4 セクション（情報設計）
ENルートのHomeに、要点を“まとめ表示”して各詳細へ：
- Hero（挨拶、名前、1段落、SNS、CTA） :contentReference[oaicite:7]{index=7}
- About（短い自己紹介）
- Journey（タイムライン：職歴 or 主要PJ） :contentReference[oaicite:8]{index=8}
- Skills（カテゴリ別チップ） :contentReference[oaicite:9]{index=9}
- Featured（Work/Blog/Art/Booksを各3件）
- Contact（Email/X/GitHub）

---

## 3. タイポグラフィ（Typography）
### 3.1 フォント方針
- 外部フォントなし（system font stack）
- 見出しは太め（700〜900）、本文は400〜500

### 3.2 タイプスケール（推奨）
- H1: `clamp(36px, 5vw, 64px)`（Heroで強く）
- H2: 24〜28px
- H3: 18〜20px
- Body: 16px
- Small/muted: 13〜14px

### 3.3 行間
- Body: 1.5
- 見出し: 1.05〜1.2（詰めて迫力）

---

## 4. カラートークン（Color）
### 4.1 カラー役割（MECE）
- Background: `--bg`
- Surface/Card: `--card`
- Text primary: `--fg`
- Text secondary: `--muted`
- Border: `--border`
- Accent: `--accent`（1色固定）
- Focus: `--focus`（accentと同一でもOK）

### 4.2 推奨パレット（例）
- bg: #0b0b0d
- card: #111116
- fg: #f5f5f7
- muted: #b8b8c2
- border: #f5f5f7（半透明運用も可）
- accent: #A3FF12（蛍光系）
> ※参考サイトの“雰囲気”は高コントラスト＋アクセント一点。Neo-brutalismの一般特性にも一致 :contentReference[oaicite:10]{index=10}

---

## 5. スペーシング（Spacing）
8pxグリッドで統一：
- xs: 8
- sm: 12
- md: 16
- lg: 24
- xl: 32

セクション間：
- SectionCard の上下マージン：18〜24px

---

## 6. コンポーネント仕様（Components）
### 6.1 Topbar（上部ナビ）
目的：常に主要導線を提供（Home/Work/Blog/Art/Books/About/Contact + 言語切替）
- sticky
- 背景は半透明 + うっすら境界線
- 左：`Brand`（1文字ロゴ、太枠＋影）
- 右：リンク群（hoverでunderline）
- CTA（Contact）は accent 背景 + 太枠 + 影
参考サイトも上部ナビ + CTA を持つ :contentReference[oaicite:11]{index=11}

**Do**
- ナビ項目は増やしすぎない（最大7）
**Don’t**
- ドロップダウン多用（重い＆neo-brutalの“直球感”が死ぬ）

### 6.2 Hero
- `Kicker`（Hi there! 的な短文） :contentReference[oaicite:12]{index=12}
- H1（I’m Natsume.）
- 1段落（最大3〜4行）
- SNSリンク（Email / X / GitHub）
- CTAボタン（メール）

### 6.3 SectionCard（共通カード）
- border: 2〜3px
- shadow: ずれ影固定（例：6px 6px 0）
- background: card色
- padding: 18px（モバイル） / 20〜24px（デスクトップ）

### 6.4 Timeline（Journey）
参考サイトは職歴タイムラインの連なり :contentReference[oaicite:13]{index=13}
構造：
- Title（Role @ Company）
- Date range（例：Jul 2020 - Nov 2025）
- 1〜2行の概要（impact）
- Location（muted）
スタイル：
- 各アイテムは `border-top` で区切る
- 余白で“積層”感を出す

### 6.5 Chips（Skills/Tags）
参考サイトはカテゴリごとに大量の単語が並ぶ :contentReference[oaicite:14]{index=14}
仕様：
- inline-flex / wrap
- chipは “枠＋太字” のみ（装飾しすぎない）
- hoverで border色 or 下線を変える程度

### 6.6 WorkCard（一覧）
カード内：
- Title
- Summary（muted）
- Stack chips
- Links（Read / GitHub / Site）
一覧レイアウト：
- Desktop: 2カラム grid
- Mobile: 1カラム

### 6.7 BlogRow（一覧）
- Title
- Date（muted）
- Summary（1〜2行でクランプ）
- Tags（chipsは省略可）

### 6.8 ArtGallery（一覧）
- 正方形サムネ（object-fit: cover）
- 画像はlazy-load
- クリックで詳細（1作品ページ）
- 詳細ページは “1作品 = 1〜5枚” を想定（多すぎない）

### 6.9 BooksList（一覧）
- Title / Author / Finished date / Rating / Note（1行）
- UIはテーブルより “リスト” で（モバイルがラク）

### 6.10 Footer
- 小さく、muted
- Terminal導線は将来（参考サイトはFooterからTerminalへ） :contentReference[oaicite:15]{index=15}

---

## 7. インタラクション（Interaction）
### 7.1 Hover/Active
- link: underline
- CTA: 少しだけ影/位置を変える（任意）
- active nav: `aria-current="page"` で視覚強調

### 7.2 Motion
- 基本なし（軽量）
- 入れるなら `prefers-reduced-motion` 尊重（CSSで無効化）

---

## 8. アクセシビリティ（A11y）
- フォーカスリングは消さない（accentで見えるように）
- 画像alt必須（Artは特に）
- `<html lang="en">` / `<html lang="ja">` 必須
- 言語対応は `hreflang` で相互参照（localized variations） :contentReference[oaicite:16]{index=16}

---

## 9. パフォーマンス（軽量化）
- 外部フォント無し
- JSは必要ページだけ `type="module"` で実行
- 画像は最小・webp推奨・lazy
- CSSは1ファイル、影/枠のデザインで“重さなしで派手”を作る
Neo-brutalismは装飾が少なくても強い見た目を作りやすい :contentReference[oaicite:17]{index=17}

---

## 10. 実装チェックリスト（UI品質）
### 見た目
- [ ] 太枠 + ずれ影が全カードで統一されている
- [ ] H1が十分に大きく、Heroで“顔”が作れている
- [ ] mutedテキストの階層が分かる（主/従）
- [ ] chipsが詰まりすぎず、wrapしても崩れない

### 体験
- [ ] ナビが常に機能する（sticky）
- [ ] モバイルで2カラムが1カラムに落ちる
- [ ] 画像遅延読み込みで初回が軽い
- [ ] EN/JAで同じ構造が保たれている

### SEO/i18n
- [ ] 各対応ページに `hreflang` を相互に設定 :contentReference[oaicite:18]{index=18}
- [ ] `<html lang>` が正しい

---

## 11. “コピーにならないための差別化ポイント”（必須）
- 色（accent・bg・shadow色）をオリジナルに固定
- 角丸/影オフセット/ボーダー太さを独自ルールにする
- セクションの並びを “自分の情報設計” に最適化（例：FeaturedにArt/Booksを加える）
- アイコン/アバター/装飾画像（もし使うなら）を自作にする
- Hero文言・CTA・フッター文言はオリジナル

> “雰囲気”は近くても、上記が揃えば十分に別物として成立する。
