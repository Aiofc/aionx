import { Button } from '@aionx/aionx-ui';
import React from 'react';
import { Icons } from './icons';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function GitHubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
      }
    >
      <Icons.gitHub className="mr-2 h-4 w-4" />
      GitHub
    </Button>
  );
}
