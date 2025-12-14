import { Chat } from '@/types';

export interface IChatListProps {
    chats: Chat[];
    onCloseDrawer?: () => void;
}