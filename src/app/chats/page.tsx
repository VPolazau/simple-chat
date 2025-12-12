'use client';

import { useGetChatsQuery } from '@/store/chatApi';
import { DialogScreen } from '@/templates';

export default function ChatsPage() {

    useGetChatsQuery();

    return <DialogScreen />
}