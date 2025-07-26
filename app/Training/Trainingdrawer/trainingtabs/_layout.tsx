import { FontAwesome6 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
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
            name="Weight Training"
            options={{
              title: 'Weight Training',
              headerShown: false, // ヘッダーを非表示にする
              tabBarIcon: ({ color }) => <FontAwesome6 name="dumbbell" size={25} color={color} />
            }}
        />

          <Tabs.Screen
            name="BodyWeight Training"
            options={{
              title: 'Bodyweight Training',
              headerShown: false, // ヘッダーを非表示にする
              tabBarIcon: ({ color }) => <Entypo name="man" size={24} color={color} />
            }}
          />
        </Tabs>
      </Portal.Host>
    </PaperProvider>
  );
}