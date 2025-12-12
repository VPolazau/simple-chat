import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Chat, Message, StreamEvent } from '@/types';
import { chatActions } from '@/store/chatSlice';

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api" }),
    tagTypes: ["Chat", "Message"],
    endpoints: (builder) => ({
        getChats: builder.query<Chat[], void>({
            query: () => "/chats",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((c) => ({ type: "Chat" as const, id: c.id })),
                        { type: "Chat", id: "LIST" },
                    ]
                    : [{ type: "Chat", id: "LIST" }],
        }),

        getMessages: builder.query<Message[], string>({
            query: (chatId) => `/chats/${chatId}/messages`,
            providesTags: (result, _error, chatId) =>
                result
                    ? [
                        ...result.map((m) => ({ type: "Message" as const, id: m.id })),
                        { type: "Message", id: `LIST_${chatId}` },
                    ]
                    : [{ type: "Message", id: `LIST_${chatId}` }],
        }),
        sendMessage: builder.mutation<Message, { chatId: string; text: string; author?: "me" | "them" }>({
            query: ({ chatId, text, author = "me" }) => ({
                url: `/chats/${chatId}/messages`,
                method: "POST",
                body: { text, author },
            }),
        }),

        subscribeToChat: builder.query<null, string>({
            queryFn: () => ({ data: null }),
            async onCacheEntryAdded(chatId, { cacheEntryRemoved, dispatch }) {
                const es = new EventSource(`http://localhost:3001/api/stream/${chatId}`);

                const onMessage = (e: MessageEvent) => {
                    let payload: StreamEvent | null = null;
                    try {
                        payload = JSON.parse(e.data);
                    } catch {
                        return;
                    }

                    if (payload?.type === "new-message") {
                        dispatch(chatActions.messageReceived(payload.message));
                    }
                };

                es.addEventListener("message", onMessage);

                try {
                    await cacheEntryRemoved;
                } finally {
                    es.removeEventListener("message", onMessage);
                    es.close();
                }
            },
        }),

    }),
});

export const {
    useGetChatsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useSubscribeToChatQuery,
} = chatApi;