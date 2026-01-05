# Neo-Brutalism（Neobrutalism / Neubrutalism）調査まとめ

個人ホームページを “Neo-Brutalism” に則って作るためのリサーチノート

## 0. まず結論（このスタイルの正体）

**Neo-Brutalism** は、いわゆる *Brutalism（ブルータリズム）* の “粗さ/反骨” を引き継ぎつつ、**よりカラフルで秩序だった（=実用に寄せた）**ビジュアルデザイントレンド。特徴は **高コントラスト／ブロッキーなレイアウト／大胆な色／太い枠線／未完成っぽさ**。 ([Nielsen Norman Group][1])

「ミニマルでスムーズなUI（過度な整い）への反動」として、“あえて不格好・生々しい” 方向に振りつつ、**使いにくさまで再現しない**のがコツ。 ([Nielsen Norman Group][1])

---

## 1. Brutalismとの関係（背景を押さえる）

### 1.1 建築の Brutalism（語源）

建築のブルータリズムは、装飾よりも**素材や構造の「正直さ」**を前面に出す潮流で、語源は「béton brut（生コンクリート）」と結びつけて語られることが多い。 ([tate.org.uk][2])

### 1.2 Webの Brutalism（2つの流派が混ざりがち）

Web文脈の “Brutalism” は、

* **素朴でユーティリティ寄り（プレCSSっぽい）**
* **意図的に規範を壊す（グリッチ/破綻を含む）**
  みたいな方向性が混ざりやすい、という整理がある。 ([Smashing Magazine][3])

### 1.3 Neo-Brutalismは「壊す」より「効かせる」

NN/g（Nielsen Norman Group）は、Neo-Brutalismを **Brutalismの進化形**として「高コントラスト、ブロック状、太枠、未完成要素」に定義しつつ、**Brutalismよりカラフルで秩序がある**と説明している。 ([Nielsen Norman Group][1])

---

## 2. Neo-Brutalismの“観測される共通特徴”（見た目の要素分解）

NN/gが挙げる核の特徴：

* **High Contrast & Bright Colors（強い対比＋鮮やか色）** ([Nielsen Norman Group][1])
* **Thick Lines & Geometric Shapes（太線＋幾何学）** ([Nielsen Norman Group][1])
* **Blocky layout（ブロックの積み木感）** ([Nielsen Norman Group][1])
* **“Unpolished” elements（未完成/ラフさ）** ([Nielsen Norman Group][1])

ここから、Webでよく見る “型” に落とすとこう。

### 2.1 画面全体のルック

* 背景は **白 or 明るい単色** が多い（色の主役はコンポーネントに寄せる）
* 影は “自然” じゃなくて **漫画的（ハードシャドウ、オフセット大きめ）**
* 角丸は **0〜少し**（丸めると一気に別系統になる）

### 2.2 余白の扱い（ここが完成度を決める）

“うるさく” しがちなので、**余白で制御**する。NN/gも、読みやすさ確保のために余白とパディングの重要性を強調してる（24–32pxのような明確な余白戦略）。 ([Nielsen Norman Group][1])

### 2.3 タイポグラフィ

* 見出し：極太・大サイズ（ポスター/雑誌の見出し感）
* 本文：読みやすいニュートラル（Inter/Roboto系など）
  “見出しは暴れてOK、本文は読ませる” の二段構えが推奨されている。 ([Nielsen Norman Group][1])

### 2.4 カラー運用（最重要）

* **2〜3色＋黒＋白** に絞るのが安全（色が増えるほど“ただのカオス”へ） ([Nielsen Norman Group][1])
* ただし“派手な配色”でも **コントラスト比**は満たす（黄×シアン等は事故りやすい）
  NN/gはコントラストチェックの重要性を明確に述べている。 ([Nielsen Norman Group][1])

---

## 3. 世界中の “Neo-Brutalismっぽいサイト” に共通する体験設計パターン

※「サイト例」を眺めると、見た目だけでなく **体験の作り**にも共通点が出る。

### 3.1 “Broken grid（壊れたグリッド）” は、壊し方が決まってる

海外のまとめでは、Neo-Brutalismの例として

* 壊れたグリッド
* 巨大タイポ
* 強い色の衝突
* “変な効果”
  が繰り返し出てくる。 ([Really Good Designs][4])

ただし多くのサイトは、完全に無秩序ではなく

* **ベースはグリッド**
* そこから **1〜2箇所だけ逸脱**
  みたいに “コントロールされた破壊” をしている（ここが上手いと一気に洗練される）。

### 3.2 マイクロインタラクションが「遊び心の証拠」になる

* カーソル連動の仕掛け
* スクロールでの小ネタ
* ミニゲーム要素
  みたいな “ちょい遊び” が、ブルータル寄りサイトでよく採用される。AwwwardsのBrutalism系キュレーションにも、ゲームや強いカーソル演出を含む例が多い。 ([Awwwards][5])
  One Page Loveのまとめでも、ホバーで紙がめくれる/スプレー表現など “触って楽しい” 方向の例が挙げられている。 ([One Page Love][6])

### 3.3 “90s/Y2Kノスタルジー” を混ぜる（ただしやりすぎ注意）

Neo-Brutalismは、Brutalism単体より **90年代っぽいグラフィック要素**と混ざって語られることが多い。 ([Nielsen Norman Group][1])
具体例：

* ステッカー/付箋みたいなラベル
* クリップ/バインダー風のUI
* 簡易なアイコンや原色図形

### 3.4 “ブランドの思想” と相性がいい

NN/gは、FigmaやGumroadの例を挙げつつ、**大胆なコントラスト＋生っぽさ**が「クリエイターの自由」「独立性」「無駄を削いだ機能性」といった思想と噛み合う、と説明している。 ([Nielsen Norman Group][1])

---

## 4. 個人ホームページに落とすための設計テンプレ（おすすめ構成）

Neo-Brutalismは “見た目が強い” ので、情報設計はむしろ堅実が成功しやすい。

### 4.1 ページ構成（1ページでも成立する）

1. **Hero**

   * 名前（巨大見出し）
   * 肩書き（短い）
   * CTA（2つまで：例「作品を見る」「連絡する」）
2. **Works / Projects**

   * カードの積み上げ（太枠＋影）
3. **About**

   * 長文は避け、箇条書き中心
4. **Writing / Notes（任意）**

   * 小さめカードで一覧
5. **Contact**

   * SNS/メール（ボタン大きく）

### 4.2 典型コンポーネント（“Neo-Brutalっぽく見える部品”）

* Button：太枠＋オフセット影＋ホバーで位置が “カクッ” と動く
* Card：3pxくらいの枠＋影、見出しは太く、本文は普通
* Tag/Badge：角丸小さめ、原色1色で面積を小さく
* Input：枠とフォーカスを強調（フォーカスリングを “デザイン要素” にする発想が相性良い） ([Nielsen Norman Group][1])

---

## 5. UX / アクセシビリティ（“強い見た目” を成立させる条件）

Neo-Brutalismは派手なので、ここを外すと一気に「読めない・疲れる」になる。

### 5.1 NN/gが推す “Best Practices”（実務の要点）

* **Usability最優先**：明確なボタン、読みやすい文字、余白 ([Nielsen Norman Group][1])
* **コントラスト比を守る**：派手でも読めなきゃ終わり ([Nielsen Norman Group][1])
* **色数を絞る（2–3色）**：情報の焦点がブレない ([Nielsen Norman Group][1])
* **可読性**：見出しと本文の役割分担 ([Nielsen Norman Group][1])
* **インタラクションのフィードバック**：ホバー/フォーカスが分かるように ([Nielsen Norman Group][1])
* **“単純すぎて” 階層が消えないように**：サイズ差でヒエラルキーを作る ([Nielsen Norman Group][1])

### 5.2 WCAG 2.2（フォーカスが隠れない/見える）

キーボード操作ユーザー向けに、フォーカス表示や「フォーカスが隠れない」要件がWCAG 2.2で追加・整理されている。 ([W3C][7])
Neo-Brutalismは “太線” を採用しやすいので、**フォーカスリングをむしろデザインとして主役にしやすい**（ここは相性が良い）。

---

## 6. “Neo-Brutalismっぽいのに、ちゃんと洗練” させるコツ

### 6.1 壊す場所を「1つ」に限定する

* 壊すのは **レイアウト** か **タイポ** か **動き** のどれか1つ
* 残りは規律で支える（特に本文・ナビは壊さない）

### 6.2 影と枠を “統一ルール” にする

* 枠線：常に同じ太さ（例 3px）
* 影：常に同じ方向・オフセット（例 4px, 4px）
* 角丸：0 or 少し（混ぜると弱く見える）

### 6.3 CTAは少なく、デカく、迷わせない

Neo-Brutalismは視覚情報が多いので、CTAが増えるほど “ノイズ化” しやすい。
**「主CTA 1つ + 副CTA 1つ」**くらいが安全。

---

## 7. 参考になる “サイト/ギャラリー” の探し方（世界の事例を見るルート）

* **Awwwards（Brutalism collection）**：Brutalism/Brutal系の受賞・掲載例がまとまっている。 ([Awwwards][5])
* **ReallyGoodDesigns（Neo Brutalist examples）**：最近の “ネオ寄り” を大量に俯瞰できる（壊れグリッド、巨大タイポ、アニメーションなどの傾向が読み取れる）。 ([Really Good Designs][4])
* **One Page Love（Brutalist Websites）**：ランディング/ポートフォリオ系の “触って楽しい” 例が拾える。 ([One Page Love][6])
* **NN/g（定義＋実務の注意点が強い）**：見た目だけじゃなく “使える” に落とす観点がある。 ([Nielsen Norman Group][1])

---

## 9. 最後に：個人サイト向けチェックリスト

* [ ] 色は **2–3色＋黒白** に収まってる ([Nielsen Norman Group][1])
* [ ] 本文は読みやすいフォント/サイズで、行間も確保してる ([Nielsen Norman Group][1])
* [ ] ボタン/リンクのホバー・フォーカスが明確 ([Nielsen Norman Group][1])
* [ ] 余白（24–32px級）で “呼吸” がある ([Nielsen Norman Group][1])
* [ ] “壊す” のは1箇所だけ（他は規律）
* [ ] キーボード操作でフォーカスが隠れない ([W3C][7])

[1]: https://www.nngroup.com/articles/neobrutalism/ "Neobrutalism: Definition and Best Practices - NN/G"
[2]: https://www.tate.org.uk/art/art-terms/b/brutalism?utm_source=chatgpt.com "Brutalism - Tate"
[3]: https://www.smashingmagazine.com/2020/01/split-personality-brutalist-web-development/ "The Split Personality Of Brutalist Web Development — Smashing Magazine"
[4]: https://reallygooddesigns.com/neo-brutalist-website-examples/ "16 Neo Brutalist Website Examples That Refuse To Play It Safe"
[5]: https://www.awwwards.com/awwwards/collections/brutalism/ "Brutalism - Awwwards"
[6]: https://onepagelove.com/brutalist-websites "25 Brutalist Websites for Inspiration"
[7]: https://www.w3.org/TR/WCAG22/?utm_source=chatgpt.com "Web Content Accessibility Guidelines (WCAG) 2.2"
[8]: https://shadcn.io/template/ekmas-neobrutalism-components?utm_source=chatgpt.com "Neobrutalism Components - Free React Nextjs Template"
[9]: https://brutalistui.site/?utm_source=chatgpt.com "Brutalist UI - Neo Brutalism React Component Library"
[10]: https://neo-brutalism-ui-library.vercel.app/?utm_source=chatgpt.com "Neo Brutalism UI"
[11]: https://github.com/Walikuperek/Neo-brutalism-CSS?utm_source=chatgpt.com "Neo-Brutalism CSS Library"
