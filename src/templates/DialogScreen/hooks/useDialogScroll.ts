import { useCommonState } from '@utils';
import { TMessageWithFlags } from '../DialogScreen.declarations';
import { useListRef } from 'react-window';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { NEAR_BOTTOM_THRESHOLD } from '../DialogScreen.constants';

export const useDialogScroll = (
    messagesFromStore: TMessageWithFlags[],
    pendingMessages: TMessageWithFlags[],
) => {
    const { selectedChatId } = useCommonState();

    const allMessages: TMessageWithFlags[] = useMemo(
        () => [...messagesFromStore, ...pendingMessages],
        [messagesFromStore, pendingMessages]
    );

    const [isNearBottom, setIsNearBottom] = useState(true);

    const listRef = useListRef(null);

    const scrollToLast = useCallback(() => {
        const list = listRef.current;
        if (!list) return;

        const index = allMessages.length - 1;
        if (index < 0) return;

        try {
            list.scrollToRow({
                index,
                align: "end",
            });
        } catch {}
    }, [allMessages.length]);

    const scrollToBottom = () => {
        if (!allMessages.length) return;
        scrollToLast();
        setIsNearBottom(true);
    };

    // при смене чата вниз
    useLayoutEffect(() => {
        if (!selectedChatId || !allMessages.length) return;
        setIsNearBottom(true);
        requestAnimationFrame(scrollToLast);
    }, [selectedChatId]);

    // чтобы не дёргался чат при получении сообщения
    useLayoutEffect(() => {
        if (!allMessages.length || !isNearBottom) return;
        requestAnimationFrame(scrollToLast);
    }, [allMessages.length, isNearBottom]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        const { scrollTop, scrollHeight, clientHeight } = target;

        const distanceToBottom =
            scrollHeight - (scrollTop + clientHeight);

        setIsNearBottom((prev) => {
            const next = distanceToBottom < NEAR_BOTTOM_THRESHOLD;
            return prev === next ? prev : next;
        });
    };

    return {
        listRef,
        isNearBottom,
        scrollToBottom,
        handleScroll,
        allMessages
    };
};
