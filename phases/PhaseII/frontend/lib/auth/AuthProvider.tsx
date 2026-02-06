"use client";

import { AuthProvider as AuthProviderImpl } from "./useAuth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProviderImpl>{children}</AuthProviderImpl>;
}