import React from "react";
import { UserButton } from '@clerk/nextjs';

export default function UserPage() {
  return <UserButton afterSignOutUrl="/sign-in" />;
}
