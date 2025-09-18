export const SOCKET_EVENTS = {
    CHAT_CREATE: 'chat:create',
    CHAT_CREATED: 'chat:created',
    CHAT_GET_ALL: 'chat:get:all',
    CHAT_SEND_MESSAGE: 'message:send',
    CHAT_GET_MESSAGES: 'message:sent',
    CHAT_GET_ONE: 'chat:get:one',
    CHAT_GET_ONLINE_USERS: 'chat:onlineUsers',
    MESSAGE_SEEN : 'message:seen'
} as const;