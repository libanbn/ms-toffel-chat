export interface ChatMessage {
  id: string;
  messageType: string;
  createdDateTime: Date;
  chatId: string;
  from?: {
    user: {
      id: string;
      displayName: string;
      username: string;
    };
  };
  body: {
    contentType: string;
    content: string;
  };
}
