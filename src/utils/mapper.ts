import { ChatMessage, Chatroom, User } from '../types/';

export const mapChatroom = (body: any): Chatroom => {
  var users: User[] = [];

  if (body.members) {
    users = body.members.map((m: { userId: string; displayName: string; email: string }) => {
      return {
        id: m.userId,
        displayName: m.displayName,
        username: m.email?.replaceAll('@avento.no', ''),
      };
    });
  }

  return {
    id: body.id,
    topic: body.topic ?? users.filter((u) => !u.displayName.includes('Liban B'))[0]?.displayName ?? 'Unknown chat',
    users,
  };
};

export const mapChatMessages = (body: any): ChatMessage => {
  let username = '';

  if (body.from?.user?.email) {
    let email: string = body.from.user.email;
    username = email.replaceAll('@avento.no', '');
  }

  return {
    id: body.id,
    messageType: body.messageType,
    createdDateTime: body.createdDateTime,
    chatId: body.chatId,
    body: {
      contentType: body.body.contentType,
      content: body.body.content,
    },
    from: {
      user: {
        id: body.from?.user?.id,
        displayName:
          body.from?.user?.displayName ?? body.from?.application?.displayName ?? body.from?.user?.displayName,
        username: username,
      },
    },
  };
};
