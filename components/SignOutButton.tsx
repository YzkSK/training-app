import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text } from 'react-native'
import { Button } from 'tamagui'


export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      router.replace('/auth/signIn')
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Button onPress={handleSignOut} style={{
          width: '80%',
          marginBottom: 10,
          backgroundColor: 'darkgray',
          color: 'black',
        }}>
      <Text>Sign out</Text>
    </Button>
  )
}