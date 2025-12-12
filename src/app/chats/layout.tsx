'use client';

import { BasePage, PageLoader } from '@ui';
import dynamic from 'next/dynamic';
import { usePageTransition } from '@utils';

const Sidebar = dynamic(() => import('@/templates').then((mod) => mod.Sidebar), { ssr: false });

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
    const { isTransitioning } = usePageTransition();

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <BasePage loadingElement={<PageLoader isLoading={isTransitioning} />}>
                {children}
            </BasePage>
        </div>
    );
}
