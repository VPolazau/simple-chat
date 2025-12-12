import React, { FC } from 'react';

import { ChatListItem } from '@/templates/ChatListItem/ChatListItem';
import { IChatListProps } from '@/templates/ChatList/ChatList.declarations';
import { Typography } from '@mui/material';
import { Separator } from '@ui';
import { useDispatch } from 'react-redux';
import { chatActions } from '@/store/chatSlice';

export const ChatList: FC<IChatListProps> = ({
    chats
}) => {
    const dispatch = useDispatch();
    return (
        <>
            <Typography variant="h5" sx={{ margin: '10px auto' }}>Чаты</Typography>
            <Separator type="dashed" />
            {chats.map(({id, name, avatar, lastMessage}) => (
                <ChatListItem
                    key={id}
                    id={id}
                    name={name}
                    avatar={avatar}
                    lastMessage={lastMessage}
                    onClick={(id) => dispatch(chatActions.setSelectedChatId(id))}
                />
            ))}
        </>
    )
}