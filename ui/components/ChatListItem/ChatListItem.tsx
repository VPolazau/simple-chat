import React from "react";
import {
    ListItem,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
} from "@mui/material";
import { IChatListItemProps } from './ChatListItem.declarations';

export const ChatListItem: React.FC<IChatListItemProps> = ({
    id,
    name,
    avatar,
    lastMessage,
    onClick,
    selected,
}) => (
    <ListItem disablePadding>
        <ListItemButton
            selected={selected}
            onClick={() => onClick?.(id)}
            sx={{
                paddingY: 1.2,
                "&:hover": { backgroundColor: "action.hover" },
            }}
        >
            <ListItemAvatar>
                <Avatar src={avatar} alt={name} />
            </ListItemAvatar>

            <ListItemText
                primary={
                <Typography variant="subtitle1" fontWeight={600}>
                    {name}
                </Typography>
            }
                secondary={
                <Typography variant="body2" color="text.secondary" noWrap>
                    {lastMessage}
                </Typography>
            }
            />
        </ListItemButton>
    </ListItem>
);
