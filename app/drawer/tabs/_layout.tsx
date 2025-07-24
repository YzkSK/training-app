import { FontAwesome6 } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { Provider as PaperProvider, Portal } from 'react-native-paper'; // ProviderとPortalをインポート

export default function TabLayout() {
  return (
    // react-native-paperのProviderでラップすることで、テーマやPortalが利用可能になります。
    <PaperProvider>
      {/* Portalは、FABのようなオーバーレイ要素が正しくレンダリングされるために必要です。 */}
      <Portal.Host>
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
          <Tabs.Screen
            name="fitness"
            options={{
              title: 'Fitness',
              headerShown: false, // ヘッダーを非表示にする
              tabBarIcon: ({ color }) => <FontAwesome6 name="person-walking" size={24} color={color} />,
            }}
        />

          <Tabs.Screen
            name="recipe"
            options={{
              title: 'Recipe',
              headerShown: false, // ヘッダーを非表示にする
              tabBarIcon: ({ color }) => <MaterialIcons size={28} name="set-meal" color={color} />,
            }}
          />
        </Tabs>
      </Portal.Host>
    </PaperProvider>
  );
}
