// app/drawer/contexts/RecipeContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

// レシピアイテムの型定義
export interface RecipeItem { // export して他のファイルからインポートできるように
  id: string;
  title: string;
  ingredients: string[]; // 材料のリスト
  instructions: string[]; // 作り方のステップのリスト
  notes?: string; // メモ (オプション)
}

// Recipe Context の型定義
interface RecipeContextType {
  recipes: RecipeItem[];
  addRecipe: (recipe: Omit<RecipeItem, 'id'>) => void; // id は Context 側で生成
  updateRecipe: (updatedRecipe: RecipeItem) => void; // 既存のレシピを更新
  getRecipeById: (id: string) => RecipeItem | undefined; // IDでレシピを取得
}

// 初期データ（テスト用）
const initialRecipes: RecipeItem[] = [
  {
    id: 'r1',
    title: '簡単チキンカレー',
    ingredients: ['鶏もも肉 300g', '玉ねぎ 1個', '人参 1本', 'カレールー 1箱', '水 600ml'],
    instructions: [
      '鶏肉、野菜を食べやすい大きさに切る。',
      '鍋に油を熱し、鶏肉を炒める。',
      '玉ねぎ、人参、じゃがいもを加えてさらに炒める。',
      '水を加えて煮込み、アクを取る。',
      '野菜が柔らかくなったら火を止め、ルーを加えて溶かす。',
      '再び弱火でとろみがつくまで煮込む。'
    ],
    notes: '隠し味にりんごのすりおろしやハチミツを入れるとコクが増します。',
  },
  {
    id: 'r2',
    title: '基本のトマトパスタ',
    ingredients: ['パスタ 200g', 'ホールトマト缶 1缶', 'ニンニク 1かけ', 'オリーブオイル 大さじ2', '塩、こしょう 少々', 'バジル 適量'],
    instructions: [
      'パスタを茹で始める。',
      'フライパンにオリーブオイルと潰したニンニクを入れ弱火で香りを出す。',
      'ホールトマトを加えて潰しながら煮詰める。',
      '茹で上がったパスタを加えてソースとよく絡める。',
      '塩、こしょうで味を調え、仕上げにバジルを散らす。'
    ],
    notes: 'お好みで粉チーズをかけても美味しいです。',
  },
  {
    id: 'r3',
    title: 'ふんわり卵サンド',
    ingredients: ['食パン(8枚切り) 2枚', '卵 2個', 'マヨネーズ 大さじ2', '塩、こしょう 少々', 'バター 少量'],
    instructions: [
      '卵を茹でてゆで卵を作り、細かく潰す。',
      '潰した卵にマヨネーズ、塩、こしょうを加えて混ぜる。',
      '食パンにバターを塗り、卵サラダを挟む。',
      '耳を切り落とし、半分に切る。'
    ],
    notes: '辛子マヨネーズにすると大人の味になります。',
  },
];

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<RecipeItem[]>(initialRecipes);

  // 新しいレシピを追加する関数
  const addRecipe = (recipe: Omit<RecipeItem, 'id'>) => {
    const newRecipeId = `r${recipes.length + 1}`; // IDを自動生成
    const newRecipe: RecipeItem = { ...recipe, id: newRecipeId };
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
  };

  // 既存のレシピを更新する関数
  const updateRecipe = (updatedRecipe: RecipeItem) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  // IDでレシピを取得する関数
  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, getRecipeById }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};