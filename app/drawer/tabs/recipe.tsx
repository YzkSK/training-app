import { StyleSheet, Text, View } from 'react-native';
import FloatingActionButton from '../../components/FloatingActionButton';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Recipe タブ</Text>
      <FloatingActionButton />
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
