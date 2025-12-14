import { Dispatch, useEffect, useState } from 'react';
import { useSendMessageMutation } from "@/store/chatApi";
import { TMessageWithFlags } from '../DialogScreen.declarations';
import { useCommonState } from '@utils';

export const useOptimisticSend = (
    messagesFromStore: TMessageWithFlags[],
) => {
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const { selectedChatId } = useCommonState();

    const [inputValue, setInputValue] = useState("");
    const [pendingMessages, setPendingMessages] = useState<TMessageWithFlags[]>([]);

    useEffect(() => {
        if (!selectedChatId) return;

        const last = messagesFromStore[messagesFromStore.length - 1];
        if (!last) return;

        if (last.author === "me") {
            setPendingMessages((prev) => {
                const idx = prev.findIndex(
                    (m) => m.chatId === last.chatId && m.author === "me" && m.text === last.text
                );
                if (idx === -1) return prev;

                const copy = prev.slice();
                copy.splice(idx, 1);
                return copy;
            });
        }
    }, [messagesFromStore, selectedChatId]);

    const handleSendMessageRequest = async () => {
        const text = inputValue.trim();
        if (!text || !selectedChatId) return;

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage: TMessageWithFlags = {
            id: tempId,
            chatId: selectedChatId,
            author: "me",
            text,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        setPendingMessages((prev) => [...prev, optimisticMessage]);
        setInputValue("");

        try {
            await sendMessage({ chatId: selectedChatId, text }).unwrap();
            setPendingMessages((prev) =>
                prev.filter((m) => m.id !== tempId)
            );
        } catch {
            setPendingMessages((prev) =>
                prev.filter((m) => m.id !== tempId)
            );
        }
    };

    return {
        inputValue,
        setInputValue,
        handleSendMessageRequest,
        isSending,
        pendingMessages,
    }
};