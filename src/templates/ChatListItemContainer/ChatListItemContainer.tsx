import { FC } from 'react';

import { ChatListItem, IChatListItemProps } from '@ui';
import { useCommonState } from "@utils";

export const ChatListItemContainer: FC<Omit<IChatListItemProps, "selected">> = (props) => {
    const { selectedChatId } = useCommonState();

    return (
        <ChatListItem
            {...props}
            selected={selectedChatId === props.id}
        />
    );
};