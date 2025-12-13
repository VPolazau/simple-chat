import React from "react";
import {
    Box,
    Avatar,
    Typography,
} from "@mui/material";
import { useCommonState } from "@utils";

export const DialogHeader: React.FC = () => {
    const { selectedChatId, chats } = useCommonState();

    const chat = chats.find((c) => c.id === selectedChatId);

    if (!chat) return null;

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={2}
            py={1.5}
            borderBottom={1}
            borderColor="divider"
            flexShrink={0}
        >
            <Typography variant="subtitle1" fontWeight={600} noWrap>
                {chat.name}
            </Typography>
            <Avatar src={chat.avatar} alt={chat.name} />
        </Box>
    );
};
