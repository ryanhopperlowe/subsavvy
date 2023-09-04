"use client";
import { useAuth } from "@/hooks";

export default function Home() {
  const { login, logout, user } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </main>
  );
}
