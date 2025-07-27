import { useSignIn } from '@clerk/clerk-expo';
import { api } from 'convex/_generated/api'; // ConvexのAPIをインポート
import { useQuery } from 'convex/react'; // ConvexのuseQueryをインポート
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Button, Heading, Input, Text, XStack, YStack } from 'tamagui';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false); // ローディング状態を追加
  const [errorMessage, setErrorMessage] = React.useState(''); // エラーメッセージ状態を追加

  // Convexから現在のユーザー情報を取得するクエリ
  // サインイン成功後にユーザーのモードを確認するために使用
  const currentUser = useQuery(api.users.getCurrent);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true); // ローディング開始
    setErrorMessage(''); // エラーメッセージをクリア

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });

        // サインイン成功後、Convexのユーザー情報を取得
        // ConvexのgetCurrentクエリは、Clerkの認証情報に基づいてユーザーを識別するため、
        // setActiveが完了した後に呼び出すのが適切です。
        // ただし、useQueryはコンポーネレンントのレンダリング時に自動的に実行されるため、
        // ここで明示的に呼び出す必要はありません。
        // 必要に応じて、ユーザーモードの確認ロジックを追加できます。

        // 例: ユーザーのモードが設定されているか確認し、設定されていなければモード選択画面へ
        // Convexのユーザー情報がロードされるのを待つ必要があるかもしれません
        // ここではシンプルにホームへリダイレクトしますが、
        // 実際のアプリではcurrentUserのロード状態とmodeの有無を確認して
        // 遷移先を決定するのが良いでしょう。
        router.replace('../home');
      } else {
        // サインイン試行が完了しなかった場合（例：2段階認証が必要など）
        console.error('Sign-in attempt not complete:', JSON.stringify(signInAttempt, null, 2));
        setErrorMessage('サインインに失敗しました。詳細を確認してください。');
      }
    } catch (err) {
      console.error('Sign-in error:', JSON.stringify(err, null, 2));
      // Clerkのエラーメッセージをユーザーに表示
      if (
        typeof err === 'object' &&
        err !== null &&
        'errors' in err &&
        Array.isArray((err as any).errors) &&
        (err as any).errors.length > 0
      ) {
        setErrorMessage((err as any).errors[0].message);
      } else {
        setErrorMessage('サインイン中に予期せぬエラーが発生しました。');
      }
    } finally {
      setLoading(false); // ローディング終了
    }
  };

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
      {errorMessage ? (
        <Text color="red" style={{ marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}
      <Button
        onPress={onSignInPress}
        disabled={loading} // ローディング中はボタンを無効化
        style={{
          width: '80%',
          marginBottom: 10,
          backgroundColor: 'darkgray',
          color: 'black',
        }}>
        {loading ? 'サインイン中...' : 'Continue'}
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
  );
}
