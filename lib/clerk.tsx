import { ClerkProvider } from '@clerk/nextjs';

export function withClerkProvider(Component: any) {
  return function ClerkWrapped(props: any) {
    return (
      <ClerkProvider>
        <Component {...props} />
      </ClerkProvider>
    );
  };
}
