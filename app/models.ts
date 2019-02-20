export interface Message {
    name: string;
    room:  string;
    timestamp?: string;
}

export interface ChatMessage extends Message {
    content: string;
    timestamp: string;
}