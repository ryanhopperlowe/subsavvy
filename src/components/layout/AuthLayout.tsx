'use client';

import { useRouter } from 'next/navigation';

import { LoadingSpinner } from '@/components';
import { useAuth } from '@/hooks';
import { Routes } from '@/routes';

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const { oauthUser: user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <LoadingSpinner />
            </main>
        );
    }

    if (!user) {
        router.push(Routes.login.path());
    }

    return <>{children}</>;
}
