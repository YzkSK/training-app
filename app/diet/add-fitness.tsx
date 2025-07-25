// app/add-fitness.tsx
import { StyleSheet, Text, View } from 'react-native';

export default function AddFitnessScreen() {
  return (
    <View style={styles.container}>
      <Text>運動項目追加画面</Text>
      {/* ここに運動項目追加のフォームやUIを追加 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
