import { Stack } from 'expo-router';
import { ModeProvider } from '../diet/drawer/contexts/ModeContext';

export default function RootLayout() {
  return (
    <ModeProvider>
      <Stack>
        {/* ModeSelectionScreenを含むあなたの画面コンポーネント */}
        <Stack.Screen name="ModeSelectionScreen" options={{ headerShown: false }} />
      </Stack>
    </ModeProvider>
  );

}