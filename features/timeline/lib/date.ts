export const getYesterdayYmd = (base: Date = new Date()) => { //base: Date = new Date()とはbaseはDate型だしDateのオブジェクトだよとしてる
  const d = new Date(base);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
};

export const formatDateJP = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ja-JP");
  };

/*
========================================
🧠 Date と new Date(base) の理解メモ
========================================

■ 1. Dateとは？
- Dateは「ある瞬間（タイムスタンプ）」を表すオブジェクト
- 内部的には「1970-01-01T00:00:00Z からのミリ秒」で管理
- 参照型（オブジェクト）

----------------------------------------

■ 2. new Date() と Date() の違い

new Date()
→ Dateオブジェクトを作る（実務で使う）

Date()
→ 現在時刻の「文字列」を返す（ほぼ使わない）

typeof new Date() // "object"
typeof Date()     // "string"

----------------------------------------

■ 3. (base: Date = new Date()) の意味

(base: Date = new Date())

- base は Date型
- 引数が渡されなければ new Date() を使う
- テストしやすくするための設計

例：
getYesterdayYmd() → 今日を基準
getYesterdayYmd(new Date("2026-03-10")) → 固定日で計算

----------------------------------------

■ 4. なぜ new Date(base) するのか？

Dateはミュータブル（変更可能）

悪い例：

const f = (base: Date) => {
  base.setDate(base.getDate() - 1); // base自体が壊れる
}

良い例：

const f = (base: Date) => {
  const copy = new Date(base); // 防御的コピー
  copy.setDate(copy.getDate() - 1);
}

→ 呼び出し元の値を壊さない
→ 副作用を防ぐ
→ 純粋関数に近づく

----------------------------------------

■ 5. 参照型の注意

const a = new Date();
const b = a;

b.setDate(1);

→ aも変わる（同じ参照）

だからコピーが必要。

----------------------------------------

■ 6. 実務的な安全設計

✔ 引数は破壊しない
✔ 必要なら new Date(base) でコピー
✔ API用は toISOString() を使う方が安全
✔ 表示用は toLocaleDateString("ja-JP")

----------------------------------------

🔥 本質：
new Date(base) は「防御的コピー」
副作用を防ぐための実務的な書き方
*/