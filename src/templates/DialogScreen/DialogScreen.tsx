import React, { JSX, useEffect, useMemo, useState } from 'react';
import type { Message } from "@/types";
import { chatApi, useGetMessagesQuery, useSendMessageMutation, useSubscribeToChatQuery } from '@/store/chatApi';
import {
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import {
    List,
    useListRef,
} from "react-window";
import { useCommonState } from "@utils";
import { MessageRow, ErrorSnackbar, PageLoader } from '@ui';

type MessageWithFlags = Message & { isOptimistic?: boolean };

export const DialogScreen: React.FC = () => {
    const { selectedChatId, isMessagesLoading, isError, messagesByChatId } = useCommonState();
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    useGetMessagesQuery(selectedChatId!, { skip: !selectedChatId });
    useSubscribeToChatQuery(selectedChatId!, { skip: !selectedChatId });

    const messagesFromStore = selectedChatId
        ? messagesByChatId[selectedChatId] ?? []
        : [];

    const [inputValue, setInputValue] = useState("");
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [pendingMessages, setPendingMessages] = useState<MessageWithFlags[]>([]);

    const listRef = useListRef(null);

    const allMessages: MessageWithFlags[] = useMemo(
        () => [...messagesFromStore, ...pendingMessages],
        [messagesFromStore, pendingMessages]
    );

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

    useEffect(() => {
        if (!selectedChatId) return;
        if (!allMessages.length) return;

        // при смене чата вниз
        setIsNearBottom(true);

        requestAnimationFrame(() => {
            listRef.current?.scrollToRow({
                index: allMessages.length - 1,
                align: "end",
            });
        });
    }, [selectedChatId]);

    useEffect(() => {
        if (!allMessages.length) return;
        if (!isNearBottom) return;

        requestAnimationFrame(() => {
            listRef.current?.scrollToRow({
                index: allMessages.length - 1,
                align: "end",
            });
        });
    }, [allMessages.length, isNearBottom]);

    const handleSend = async () => {
        const text = inputValue.trim();
        if (!text || !selectedChatId) return;

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage: MessageWithFlags = {
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

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        const { scrollTop, scrollHeight, clientHeight } = target;

        const distanceToBottom =
            scrollHeight - (scrollTop + clientHeight);

        setIsNearBottom((prev) => {
            const next = distanceToBottom < 120;
            return prev === next ? prev : next;
        });
    };

    if (!selectedChatId) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
            >
                <Typography color="text.secondary">
                    Выбери чат, чтобы начать переписку
                </Typography>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box
                flex="1 1 auto"
                minHeight={0}
                px={2}
                pt={2}
                pb={1}
                position="relative"
                overflow="hidden"
            >

                <PageLoader isLoading={isMessagesLoading && !allMessages.length} />
                <ErrorSnackbar isError={isError && !allMessages.length} message="Что-то пошло не так" />

                {!!allMessages.length && (
                    <List
                        style={{ height: '100%', width: '100%' }}
                        rowComponent={MessageRow}
                        rowCount={allMessages.length}
                        rowHeight={64}
                        rowProps={{ items: allMessages }}
                        overscanCount={4}
                        listRef={listRef}
                        onScroll={handleScroll}
                    />
                )}
            </Box>

            <Box
                px={2}
                py={1.5}
                borderTop={1}
                borderColor="divider"
                display="flex"
                gap={1}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Введите сообщение…"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={
                        !inputValue.trim() ||
                        !selectedChatId ||
                        isSending
                    }
                >
                    Отправить
                </Button>
            </Box>
        </Box>
    );
};
