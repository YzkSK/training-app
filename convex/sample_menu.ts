/**
 * @file sample_menu.ts
 * @description フィットネスメニューのサンプルデータを定義します。
 * データベースのテーブルを想定したデータ構造です。
 */

/**
 * フィットネスメニューの各項目を表すデータ型。
 */
export interface MenuItem {
  /** データベースで自動生成される一意のID */
    _id: string;
    /** フィットネスメニューの名称 */
    name: string;
    /**
     * メニューの強度や特性を示す数値。
     * 例: METs (Metabolic Equivalents) や、1回あたりの消費カロリー係数など。
     */
    value: number;
  /** データが作成された日時 (ISO 8601 形式のタイムスタンプを推奨) */
  _creationTime: number; // JavaScriptのタイムスタンプ (ミリ秒) で表現
}

// Date.parse() を使ってスクリーンショットの日時をタイムスタンプに変換
const creationTime1 = Date.parse('2025-07-27T14:36:25');
const creationTime2 = Date.parse('2025-07-27T14:36:12');
const creationTime3 = Date.parse('2025-07-27T14:35:25');
const creationTime4 = Date.parse('2025-07-27T14:33:00');
const creationTime5 = Date.parse('2025-07-27T14:29:31');


/**
 * スクリーンショットに基づいたフィットネスメニューのサンプルデータ配列。
 */
export const sampleMenuItems: MenuItem[] = [
    {
        _id: 'ks79rh7a9zkfbtgvpdw2m7gcyxq', // IDは一意な文字列を仮定
        name: 'レッグレイズ',
        value: 0.07,
        _creationTime: creationTime1,
    },
    {
        _id: 'ks71wpnqvvk274txgj1yv8k5n9g',
        name: 'トウタッチクランチ',
        value: 0.08,
        _creationTime: creationTime2,
    },
    {
        _id: 'ks7dtbq4kd48m3q050qf2h7j3c',
        name: 'レッグリフトクランチ',
        value: 0.08,
        _creationTime: creationTime3,
    },
    {
        _id: 'ks74358s62mx7hyqsafz6c5r8n',
        name: 'サイクリング',
        value: 0.12,
        _creationTime: creationTime4,
    },
    {
        _id: 'ks700d71xnqnd65mfsw8b9z4p7',
        name: 'クランク',
        value: 0.06,
        _creationTime: creationTime5,
    },
];