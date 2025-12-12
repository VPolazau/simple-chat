import type { RowComponentProps } from 'react-window';
import React, { JSX } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { MessageRowExtraProps } from './MessageRow.declrations';

export const MessageRow = ({
    index,
    style,
    items,
}: RowComponentProps<MessageRowExtraProps>): JSX.Element => {
    const msg = items[index];
    if (!msg) {
        return <Box style={style} />;
    }

    const isMe = msg.author === "me";

    return (
        <Box
            style={style}
            display="flex"
            justifyContent={isMe ? "flex-end" : "flex-start"}
        >
            <Paper
                elevation={0}
                sx={{
                    maxWidth: "70%",
                    m: 0.5,
                    px: 1.5,
                    py: 1,
                    bgcolor: isMe ? "primary.main" : "grey.200",
                    color: isMe ? "primary.contrastText" : "text.primary",
                    borderRadius: 2,
                    opacity: msg.isOptimistic ? 0.6 : 1,
                }}
            >
                <Typography variant="body2">{msg.text}</Typography>
                <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, display: "block", mt: 0.5 }}
                >
                    {new Date(msg.createdAt).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Typography>
            </Paper>
        </Box>
    );
};