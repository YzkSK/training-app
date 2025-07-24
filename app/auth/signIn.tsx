import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, View, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import Button from '@/components/Button'; // カスタムコンポーネント
import OAuthButton from '@/components/OAuthButton'; // カスタムコンポーネント
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemedText } from '@/components/ThemedText'; // カスタムコンポーネント
import { ThemedView } from '@/components/ThemedView'; // カスタムコンポーネント
import { styles as customStyles } from "@/constants/styles"; // カスタムスタイル
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({
          session: signInAttempt.createdSessionId
        });
        // ★修正点1: 正しいホーム画面のパスにリダイレクト
        router.replace('/(home)');
      } else {
        // 2段階認証など、追加のステップが必要な場合
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  // Clerkが読み込み中の場合はローディングインジケーターを表示
  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={customStyles.authScreen}>
      <View style={customStyles.authForm}>

        {/* Header text */}
        <ThemedView style={{ marginVertical: 16, alignItems: "center" }}>
          <ThemedText type='title'>
            Sign into Your App
          </ThemedText>
          <ThemedText type='default'>
            Welcome back! Please sign in to continue
          </ThemedText>
        </ThemedView>

        {/* OAuth buttons */}
        <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <OAuthButton strategy="oauth_google">
              <MaterialCommunityIcons name="google" size={18} />{" "}
              Google
            </OAuthButton>
          </View>
        </View>

        {/* Form separator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#eee' }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center', color: "#555" }}>or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: '#eee' }} />
        </View>

        {/* Input fields */}
        <View style={{ gap: 8, marginBottom: 24 }}>
          <Text>Email address</Text>
          <TextInput
            style={customStyles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="email@example.com"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <Text>Password</Text>
          <TextInput
            style={customStyles.input}
            value={password}
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        {/* Sign in button */}
        <Button onPress={onSignInPress}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign in</Text>
          <Ionicons name='log-in-outline' color="white" size={16} />
        </Button>

        {/* Suggest new users create an account */}
        <View style={{ display: "flex", flexDirection: "row", gap: 4, justifyContent: "center", marginVertical: 18 }}>
          <Text>Don't have an account?</Text>
          {/* ★修正点2: 正しいサインアップ画面のパスにリンク */}
          <Link href="/signUp">
            <Text style={{ fontWeight: "bold" }}>Sign up</Text>
          </Link>
        </View>

      </View>
    </View>
  );
}

// ローディングインジケーターを中央に表示するためのスタイル
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});