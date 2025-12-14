import React, { FC } from 'react';
import { IChatListProps } from './ChatList.declarations';
import { Typography } from '@mui/material';
import { Separator } from '@ui';
import { useDispatch } from 'react-redux';
import { chatActions } from '@/store/chatSlice';
import { callIfExist } from '@utils';
import { ChatListItemContainer } from '@/templates';

export const ChatList: FC<IChatListProps> = ({
    chats,
    onCloseDrawer,
}) => {
    const dispatch = useDispatch();

    const handleClick = (id: string) => {
        dispatch(chatActions.setSelectedChatId(id));
        callIfExist(onCloseDrawer);
    }

    return (
        <>
            <Typography variant="h5" sx={{ margin: '10px auto' }}>Чаты</Typography>
            <Separator type="dashed" />
            {chats.map(({id, name, avatar, lastMessage}) => (
                <ChatListItemContainer
                    key={id}
                    id={id}
                    name={name}
                    avatar={avatar}
                    lastMessage={lastMessage}
                    onClick={handleClick}
                />
            ))}
        </>
    )
}