export interface Message {
    senderId: string;
    recipientId: string;
    message: string;
    datecreated: string;
    fileUrl: string | null;
  }