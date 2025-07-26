import { Stack } from 'expo-router';

export default function TrainingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="drawer"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="add-fitness"
        options={{
          title: '運動項目追加',
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="nutrition-plan"
        options={{
          title: '栄養プラン',
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}