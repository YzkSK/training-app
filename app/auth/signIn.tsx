import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Button, Heading, Input, Text, XStack, YStack } from 'tamagui'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')


  const onSignInPress = async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('../home')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <YStack style={{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    }}>
      <Heading size="$8" style={{
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
      }}>Sign in</Heading>
      <Heading size="$4" style={{
        marginBottom: 10,
      }}>Email or Username</Heading>
      <Input
        borderWidth={3}
        value={emailAddress}
        placeholder="Enter Email or User Name"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        style={{
          width: '90%',
          marginBottom: 20,
          marginRight: 20,
          marginLeft: 20,
        }}
      />
      <Heading size="$4" style={{
        marginBottom: 10,
      }}>Password</Heading>
      <Input
        borderWidth={3}
        value={password}
        placeholder="Enter Password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        style={{
          width: '90%',
          marginBottom: 20,
          marginRight: 20,
          marginLeft: 20,
        }}
      />
      <Button
        onPress={onSignInPress}
        style={{
          width: '80%',
          marginBottom: 10,
          backgroundColor: 'darkgray',
          color: 'black',
        }}>
        Continue
      </Button>
      <XStack>
        <Text>Don’t have an account? </Text>
        <Link
          href="./signUp">
          <Text
            style={{
              color: 'blue',
            }}
          >Sign Up</Text>
        </Link>
      </XStack>
    </YStack>
  )
}