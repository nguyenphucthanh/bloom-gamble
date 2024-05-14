export type MessageResponse =
  | {
      success: true;
      threadId: string;
      channel: string;
    }
  | {
      success: false;
      error?: string;
      warning?: string;
    };

export interface MessageService {
  send: (message: string, threadId?: string) => Promise<MessageResponse>;
}
