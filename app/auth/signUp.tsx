import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Heading, Input, XStack, YStack } from 'tamagui';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err: any) {
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('../screens');
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
    <>
      {pendingVerification ? (
        <YStack style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
          <Heading size="$5" mb="$3">Verify your email</Heading>
          <Input
            value={code}
            placeholder="Enter Verification Code"
            onChangeText={(code) => setCode(code)}
            style={{
              width: '80%',
            }}
          />
          <Button
            onPress={onPressVerify}
            style={{
              backgroundColor: 'darkgray',
              color: 'black',
              width: '60%',
              marginTop: 20,
            }}
          >Verify</Button>
        </YStack>
      ) : (
        <YStack style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
          <Heading size="$8" style={{
              fontWeight: 'bold',
              marginBottom: 20,
            }}>Sign Up</Heading>
          <Heading size="$4" style={{
              marginBottom: 10,
            }}>Username</Heading>
          <Input
            borderWidth={3}
            style={{
              marginBottom: 20,
              width: '90%',
            }}
            value={username}
            placeholder="Enter Username"
            onChangeText={(username) => setUsername(username)}
          />
          <Heading size="$4" style={{
              marginBottom: 10,
            }}>Email address</Heading>
          <Input
            borderWidth={3}
            style={{
              marginBottom: 20,
              width: '90%',
            }}
            value={emailAddress}
            placeholder="Enter Email"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <Heading size="$4" style={{
              marginBottom: 10,
            }}>Password</Heading>
          <Input
            borderWidth={3}
            style={{
              marginBottom: 20,
              width: '90%',
            }}
            value={password}
            placeholder="Enter Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button onPress={onSignUpPress} style={{
            width: '80%',
            marginBottom: 10,
            backgroundColor: 'darkgray',
            color: 'black',
          }}>
            Continue
          </Button>
          <XStack>
            <Text>Already have an account? </Text>
            <Link
              href="./signIn">
              <Text
                style={{
                  color: 'blue',
                }}
              >Sign In</Text>
            </Link>
          </XStack>
        </YStack>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});