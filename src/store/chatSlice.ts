import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Chat, Message } from "@/types";
import { chatApi } from "./chatApi";

interface ChatState {
    chats: Chat[];
    messagesByChatId: Record<string, Message[]>;
    selectedChatId: string | null;
    isChatsLoading: boolean;
    isMessagesLoading: boolean;
    isError: boolean;
}

const initialState: ChatState = {
    chats: [],
    messagesByChatId: {},
    selectedChatId: null,
    isChatsLoading: false,
    isMessagesLoading: false,
    isError: false,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChatId(state, action: PayloadAction<string | null>) {
            state.selectedChatId = action.payload;
        },

        messageReceived(state, action: PayloadAction<Message>) {
            const msg = action.payload;

            const list = state.messagesByChatId[msg.chatId] || [];

            if (!list.some((m) => m.id === msg.id)) {
                state.messagesByChatId[msg.chatId] = [...list, msg];
            }

            const chatIdx = state.chats.findIndex((c) => c.id === msg.chatId);
            if (chatIdx !== -1) {
                state.chats[chatIdx] = {
                    ...state.chats[chatIdx],
                    lastMessage: msg.text,
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(chatApi.endpoints.getChats.matchPending, (state) => {
                state.isChatsLoading = true;
                state.isError = false;
            })
            .addMatcher(
                chatApi.endpoints.getChats.matchFulfilled,
                (state, action: PayloadAction<Chat[]>) => {
                    state.isChatsLoading = false;
                    state.chats = action.payload;
                }
            )
            .addMatcher(chatApi.endpoints.getChats.matchRejected, (state) => {
                state.isChatsLoading = false;
                state.isError = true;
                state.chats = [];
            });
        builder
            .addMatcher(chatApi.endpoints.getMessages.matchPending, (state) => {
                state.isMessagesLoading = true;
                state.isError = false;
            })
            .addMatcher(
                chatApi.endpoints.getMessages.matchFulfilled,
                (state, action) => {
                    state.isMessagesLoading = false;
                    const chatId = action.meta.arg.originalArgs as string;
                    state.messagesByChatId[chatId] = action.payload;
                }
            )
            .addMatcher(chatApi.endpoints.getMessages.matchRejected, (state) => {
                state.isMessagesLoading = false;
                state.isError = true;
            });
    },
});

export default chatSlice.reducer;
export const chatActions = chatSlice.actions;