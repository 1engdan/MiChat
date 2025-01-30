export interface ApiResponse<T> {
    detail?: string;
    access_token?: string;
    refresh_token?: string;
    data?: T;
}

export interface ChatData {
    chatId: string;
    name: string;
    lastMessage: string;
    avatarUrl: string;
}