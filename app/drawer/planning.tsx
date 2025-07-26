import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- おすすめトレーニングのデータ ---
const trainingPlans = {
  home: {
    chest: [
      { name: 'プッシュアップ (腕立て伏せ)', description: '胸、肩、三頭筋を鍛える基本の自重トレーニングです。' },
      { name: 'ディップス', description: '椅子や台を使い、大胸筋下部を効果的に刺激します。' },
      { name: 'インクライン・プッシュアップ', description: '台などに手をついて行い、大胸筋下部をターゲットにします。' },
    ],
    back: [
      { name: '懸垂 (プルアップ)', description: '広背筋を中心に、背中全体を鍛える最強の自重トレーニングです。' },
      { name: 'インバーテッド・ロウ (斜め懸垂)', description: '机や低いバーを使い、背中の厚みを作るトレーニングです。' },
      { name: 'スーパーマン', description: 'うつ伏せになり手足を上げる動作で、脊柱起立筋を鍛えます。' },
    ],
    legs: [
      { name: 'スクワット', description: '下半身全体を鍛える王道のトレーニングです。' },
      { name: 'ランジ', description: '大臀筋と大腿四頭筋を片足ずつ効果的に鍛えます。' },
      { name: 'カーフレイズ', description: 'ふくらはぎを鍛え、ジャンプ力や安定性を高めます。' },
    ],
    shoulders: [
        { name: 'パイク・プッシュアップ', description: 'お尻を高く突き上げ、肩（特に前部）に負荷をかけます。' },
        { name: 'アームサークル', description: '腕を回す簡単な動きで、肩関節のウォームアップに最適です。' },
    ],
    arms: [
        { name: 'ダイヤモンド・プッシュアップ', description: '手でひし形を作り、上腕三頭筋を強力に刺激します。' },
        { name: 'リバース・プッシュアップ', description: '机などを背にして座り、上腕三頭筋を鍛えます。' },
    ],
    abs: [
        { name: 'プランク', description: '体幹全体を安定させる基本のトレーニングです。' },
        { name: 'クランチ', description: '腹直筋の上部をターゲットにしたトレーニングです。' },
        { name: 'レッグレイズ', description: '腹直筋の下部を効果的に鍛えます。' },
    ],
  },
  gym: {
    chest: [
      { name: 'ベンチプレス', description: 'バーベルを使い、大胸筋全体をパワフルに鍛えます。' },
      { name: 'ダンベルフライ', description: '大胸筋のストレッチと収縮を意識しやすい種目です。' },
      { name: 'ケーブルクロスオーバー', description: 'ケーブルを使い、大胸筋の内側までしっかりと刺激します。' },
    ],
    back: [
      { name: 'デッドリフト', description: '背中、お尻、脚と全身を鍛えるBIG3の一つです。' },
      { name: 'ラットプルダウン', description: '広背筋を鍛え、逆三角形の背中を作る定番種目です。' },
      { name: 'シーテッド・ロウ', description: 'ケーブルやマシンを使い、背中の中央部を鍛えます。' },
    ],
    legs: [
      { name: 'バーベルスクワット', description: '高重量を扱い、下半身全体を強力にビルドアップします。' },
      { name: 'レッグプレス', description: 'マシンを使い、安全に高重量で脚を鍛えることができます。' },
      { name: 'レッグエクステンション & カール', description: '太ももの前側と後側を個別に鍛えるマシン種目です。' },
    ],
    shoulders: [
        { name: 'ショルダープレス', description: 'バーベルやダンベルを頭上に持ち上げ、三角筋全体を鍛えます。' },
        { name: 'サイドレイズ', description: 'ダンベルを使い、肩の横幅（中部）を効果的に鍛えます。' },
    ],
    arms: [
        { name: 'バーベルカール', description: '上腕二頭筋を鍛え、力強い腕を作る基本種目です。' },
        { name: 'スカルクラッシャー', description: '上腕三頭筋を鍛え、太い腕を作るのに効果的です。' },
    ],
    abs: [
        { name: 'ケーブルクランチ', description: 'ケーブルマシンを使い、腹筋に持続的な負荷をかけます。' },
        { name: 'ハンギングレッグレイズ', description: '懸垂バーを使い、腹筋下部と体幹を強力に鍛えます。' },
        { name: 'アブローラー', description: '専用のローラーを使い、腹筋全体を限界まで追い込みます。' },
    ],
  },
};

type Location = 'home' | 'gym';
type BodyPart = keyof typeof trainingPlans.home;

export default function PlanningScreen() {
  const [location, setLocation] = useState<Location>('home');
  const bodyParts = Object.keys(trainingPlans.home) as BodyPart[];

  const renderPlan = (part: BodyPart) => {
    const plan = trainingPlans[location][part];
    const partNameJp = {
        chest: '胸',
        back: '背中',
        legs: '脚',
        shoulders: '肩',
        arms: '腕',
        abs: 'お腹'
    };

    return (
      <View key={part} style={styles.card}>
        <Text style={styles.cardTitle}>{part.charAt(0).toUpperCase() + part.slice(1)} ( {partNameJp[part]} )</Text>
        {plan.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Ionicons name="flash" size={18} color="#007aff" style={styles.itemIcon} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>おすすめトレーニングプラン</Text>
        
        {/* 場所選択 */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[styles.selectorButton, location === 'home' && styles.selectorButtonActive]}
            onPress={() => setLocation('home')}
          >
            <Ionicons name="home-outline" size={20} color={location === 'home' ? '#fff' : '#007aff'} />
            <Text style={[styles.selectorButtonText, location === 'home' && styles.selectorButtonTextActive]}>自宅</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectorButton, location === 'gym' && styles.selectorButtonActive]}
            onPress={() => setLocation('gym')}
          >
            <Ionicons name="barbell-outline" size={20} color={location === 'gym' ? '#fff' : '#007aff'} />
            <Text style={[styles.selectorButtonText, location === 'gym' && styles.selectorButtonTextActive]}>ジム</Text>
          </TouchableOpacity>
        </View>

        {/* トレーニングリスト */}
        {bodyParts.map(part => renderPlan(part))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
  },
  selectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    margin: 3,
  },
  selectorButtonActive: {
    backgroundColor: '#007aff',
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  selectorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#007aff',
  },
  selectorButtonTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
});
