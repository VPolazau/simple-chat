import React from 'react';
import { useGetMessagesQuery, useSendMessageMutation, useSubscribeToChatQuery } from '@/store/chatApi';
import {
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { List } from "react-window";
import { useCommonState } from "@utils";
import { MessageRow, ErrorSnackbar, PageLoader, Icon, LiquidGlassButton } from '@ui';
import { DialogHeader } from '@/templates';
import { useDialogScroll, useOptimisticSend } from './hooks';

export const DialogScreen: React.FC = () => {
    const { selectedChatId, isMessagesLoading, isError, messagesByChatId } = useCommonState();

    useGetMessagesQuery(selectedChatId!, { skip: !selectedChatId });
    useSubscribeToChatQuery(selectedChatId!, { skip: !selectedChatId });

    const messagesFromStore = selectedChatId
        ? messagesByChatId[selectedChatId] ?? []
        : [];

    const {inputValue, setInputValue, pendingMessages, handleSendMessageRequest, isSending} = useOptimisticSend(messagesFromStore)
    const {listRef, isNearBottom, scrollToBottom, handleScroll, allMessages} = useDialogScroll(messagesFromStore, pendingMessages);

    const handleSend = async () => {
        scrollToBottom();
        await handleSendMessageRequest();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key !== "Enter" || e.shiftKey) return;

        e.preventDefault();
        handleSend();
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
            <DialogHeader />
            <Box
                flex="1 1 auto"
                minHeight={0}
                px={2}
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

                {!isNearBottom && (
                    <LiquidGlassButton
                        onClick={scrollToBottom}
                        sx={{
                            position: "absolute",
                            bottom: 35,
                            right: 35,
                            zIndex: 2,
                            paddingTop: 2,
                        }}
                    >
                        <Icon name="arrow-chevron-down" />
                    </LiquidGlassButton>
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
                    onKeyDown={handleKeyDown}
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
