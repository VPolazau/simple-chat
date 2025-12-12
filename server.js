/* eslint-disable @typescript-eslint/no-require-imports */

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

let chats = [
    {
        id: "chat_1",
        name: "Alice Johnson",
        avatar: "https://i.pravatar.cc/40?img=1",
        lastMessage: "See you tomorrow!",
    },
    {
        id: "chat_2",
        name: "Product Team",
        avatar: "https://i.pravatar.cc/40?img=2",
        lastMessage: "New release is out 🚀",
    },
    {
        id: "chat_3",
        name: "Frontend Guild",
        avatar: "https://i.pravatar.cc/40?img=3",
        lastMessage: "Did you check the new RFC?",
    },
    {
        id: "chat_4",
        name: "Support",
        avatar: "https://i.pravatar.cc/40?img=4",
        lastMessage: "We will get back to you soon.",
    },
];

const MESSAGES_PER_CHAT = 5000;

const generateMessagesForChat = (chatId, count) => {
    const messages = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
        const isMe = i % 2 === 0;
        messages.push({
            id: `${chatId}_msg_${i}`,
            chatId,
            author: isMe ? "me" : "them",
            text: isMe
                ? `My message #${i} in ${chatId}`
                : `Reply #${i} from ${chatId}`,
            createdAt: new Date(now - (count - i) * 1000).toISOString(),
        });
    }

    return messages;
};

const messagesByChatId = {};
for (const chat of chats) {
    messagesByChatId[chat.id] = generateMessagesForChat(
        chat.id,
        MESSAGES_PER_CHAT
    );
}


const clientsPerChat = new Map();

const addClient = (chatId, res) => {
    if (!clientsPerChat.has(chatId)) {
        clientsPerChat.set(chatId, new Set());
    }
    clientsPerChat.get(chatId).add(res);
};

const removeClient = (chatId, res) => {
    const set = clientsPerChat.get(chatId);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) {
        clientsPerChat.delete(chatId);
    }
};

const broadcastToChat = (chatId, payload) => {
    const set = clientsPerChat.get(chatId);
    if (!set || set.size === 0) return;

    const data = `data: ${JSON.stringify(payload)}\n\n`;
    for (const res of set) {
        res.write(data);
    }
};

const REALTIME_INTERVAL_MS = 10000;

setInterval(() => {
    for (const [chatId, clients] of clientsPerChat.entries()) {
        if (!clients || clients.size === 0) continue;

        const nextIndex =
            (messagesByChatId[chatId]?.length ?? 0) + 1;

        const newMessage = {
            id: `${chatId}_rt_${nextIndex}`,
            chatId,
            author: "them",
            text: `Realtime message #${nextIndex} in ${chatId}`,
            createdAt: new Date().toISOString(),
        };

        if (!messagesByChatId[chatId]) {
            messagesByChatId[chatId] = [];
        }
        messagesByChatId[chatId].push(newMessage);

        const chatIdx = chats.findIndex((c) => c.id === chatId);
        if (chatIdx !== -1) {
            chats[chatIdx] = {
                ...chats[chatIdx],
                lastMessage: newMessage.text,
            };
        }

        broadcastToChat(chatId, {
            type: "new-message",
            chatId,
            message: newMessage,
        });
    }
}, REALTIME_INTERVAL_MS);


app.get(
    "/api/chats",
    (req, res) => {
        res.json(chats);
    }
);

app.get(
    "/api/chats/:chatId/messages",
    (req, res) => {
        const { chatId } = req.params;
        const list = messagesByChatId[chatId];
        if (!list) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.json(list);
    }
);

app.post(
    "/api/chats/:chatId/messages",
    (req, res) => {
        const { chatId } = req.params;
        const { text, author = "me" } = req.body || {};

        if (!messagesByChatId[chatId]) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (!text || typeof text !== "string") {
            return res.status(400).json({ message: "Text is required" });
        }

        const nextIndex = messagesByChatId[chatId].length + 1;
        const newMessage = {
            id: `${chatId}_user_${nextIndex}`,
            chatId,
            author,
            text,
            createdAt: new Date().toISOString(),
        };

        messagesByChatId[chatId].push(newMessage);

        const chatIdx = chats.findIndex((c) => c.id === chatId);
        if (chatIdx !== -1) {
            chats[chatIdx] = {
                ...chats[chatIdx],
                lastMessage: newMessage.text,
            };
        }

        broadcastToChat(chatId, {
            type: "new-message",
            chatId,
            message: newMessage,
        });

        res.status(201).json(newMessage);
    }
);

// имитация WebSocket
app.get("/api/stream/:chatId", (req, res) => {
    const { chatId } = req.params;

    if (!messagesByChatId[chatId]) {
        return res.status(404).json({ message: "Chat not found" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (res.flushHeaders) {
        res.flushHeaders();
    }

    res.write(`data: ${JSON.stringify({ type: "connected", chatId })}\n\n`);

    addClient(chatId, res);

    req.on("close", () => {
        removeClient(chatId, res);
    });
});



app.listen(PORT, () => {
    console.log(`Mock API listening on http://localhost:${PORT}`);
    console.log("GET  /api/chats");
    console.log("GET  /api/chats/:chatId/messages");
    console.log("POST /api/chats/:chatId/messages");
    console.log("GET  /api/stream/:chatId  (SSE realtime)");
});