import { SignOutButton } from '@/components/SignOutButton'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function Page() {
  const { user } = useUser()
  console.log('User:', user)

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.username}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/auth/signIn">
          <Text>Sign in</Text>
        </Link>
        <Link href="/auth/signUp">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}