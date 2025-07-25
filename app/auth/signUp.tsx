import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

// Custom components and styles from your project
import Button from '@/components/Button';
import OAuthButton from '@/components/OAuthButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles as customStyles } from '@/constants/styles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // ★修正点1: `username`のstateを追加
  const [username, setUsername] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      // ★修正点2: `username`をcreateに含める
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set 'pendingVerification' to true to display the verification form
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        // ★修正点3: 正しいホーム画面のパスにリダイレクト
        router.replace('/(home)');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
    }
  };

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
        {/* If verification is pending, show the verification form */}
        {pendingVerification ? (
          <>
            <ThemedView style={{ marginVertical: 16, alignItems: "center" }}>
              <ThemedText type='title'>Verify Your Email</ThemedText>
              <ThemedText type='default' style={{ textAlign: 'center', marginTop: 8 }}>
                We've sent a verification code to your email address. Please enter it below.
              </ThemedText>
            </ThemedView>
            <TextInput
              style={customStyles.input}
              value={code}
              placeholder="Verification Code..."
              onChangeText={(code) => setCode(code)}
            />
            <Button onPress={onPressVerify}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Verify</Text>
            </Button>
          </>
        ) : (
          // Otherwise, show the initial sign-up form
          <>
            <ThemedView style={{ marginVertical: 16, alignItems: "center" }}>
              <ThemedText type='title'>Create your account</ThemedText>
              <ThemedText type='default'>
                Welcome! Please fill in the details to get started.
              </ThemedText>
            </ThemedView>

            <OAuthButton strategy="oauth_google">
              <MaterialCommunityIcons name="google" size={18} /> Continue with Google
            </OAuthButton>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#eee' }} />
              <Text style={{ width: 50, textAlign: 'center', color: '#555' }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#eee' }} />
            </View>

            {/* ★修正点4: `username`の入力フィールドを追加 */}
            <Text>Username</Text>
            <TextInput
              style={customStyles.input}
              autoCapitalize="none"
              value={username}
              placeholder="your_username"
              onChangeText={(username) => setUsername(username)}
            />
            <Text>Email address</Text>
            <TextInput
              style={customStyles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="email@example.com"
              onChangeText={(email) => setEmailAddress(email)}
            />
            <Text>Password</Text>
            <TextInput
              style={customStyles.input}
              value={password}
              placeholder="password"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            <Button onPress={onSignUpPress}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
              <Ionicons name='caret-forward' color="white" size={16} />
            </Button>

            <View style={{ display: "flex", flexDirection: "row", gap: 4, justifyContent: "center", marginVertical: 18 }}>
              <Text>Already have an account?</Text>
              {/* ★修正点5: 正しいサインイン画面のパスにリンク */}
              <Link href="/signIn">
                <Text style={{ fontWeight: "bold" }}>Sign in</Text>
              </Link>
            </View>
          </>
        )}
      </View>
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