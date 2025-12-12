export interface IChatListItemProps {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    onClick?: (id: string) => void;
}