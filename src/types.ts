export interface Chat {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    favorite?: boolean;
}

export type Author = "me" | "them";

export interface Message {
    id: string;
    chatId: string;
    author: Author;
    text: string;
    createdAt: string;
}

export type StreamEvent = { type: "connected"; chatId: string } | { type: "new-message"; chatId: string; message: Message };