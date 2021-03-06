import axios from 'axios';
import Oidc from 'oidc-client';

import React, { createContext, useContext, useEffect } from 'react';
import { Chatroom, User, ChatMessage } from '../types';
import { mapChatMessages, mapChatroom } from '../utils/mapper';

interface Auth {
  accessToken: string;
  refreshToken?: string;
  scope: string;
  expiresAt: number;
}

interface GraphApi {
  me: () => Promise<any>;
  chats: () => Promise<Chatroom[]>;
  chatMessages: (chatId: string) => Promise<ChatMessage[]>;
  chatMessage: (chatId: string, messageId: string) => Promise<any>;
  sendChatMessage: (chatId: string, chat: ChatMessage) => Promise<any>;
  myPrecense: () => Promise<any>;
}

export const GraphApiContext = createContext<{ graphApi: GraphApi; updateAuth: (user: Oidc.User) => void } | undefined>(
  undefined,
);

export const GraphApi: React.FC = ({ children }) => {
  const cli = axios.create({
    baseURL: 'https://graph.microsoft.com/beta/',
    headers: {
      Accept: 'application/json',
    },
  });

  const updateAuth = (user: Oidc.User) => {
    cli.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;
  };

  const graphApi: GraphApi = {
    me: async (): Promise<any> => {
      return cli
        .get('me')
        .then((r) => r.data)
        .then((d) => d as User);
    },

    chats: async (): Promise<Chatroom[]> => {
      return cli
        .get(`chats?$expand=members&$top=50`)
        .then((r) => r.data as { value: Array<any> })
        .then((d) => d.value.map((i) => mapChatroom(i)));
    },

    chatMessages: async (chatId: string): Promise<any> => {
      return cli
        .get(`chats/${chatId}/messages?&$top=50`)
        .then((r) => r.data as { value: Array<any> })
        .then((d) => d.value.map((i) => mapChatMessages(i)));
    },

    chatMessage: async (chatId: string, messageId: string): Promise<any> => {
      return cli.get(`chats/${chatId}/messages/${messageId}`);
    },

    myPrecense: async (): Promise<any> => {
      return (await cli.get(`/me/presence`)).data;
    },
    sendChatMessage: function (chatId: string, chat: ChatMessage): Promise<any> {
      return cli.post(`chats/${chatId}/messages/`, chat);
    },
  };

  useEffect(() => {
    var token: Auth = { accessToken: '', expiresAt: 0, scope: '' };

    const storedToken = localStorage.getItem(
      'oidc.user:https://login.microsoftonline.com/cac3ff2c-c079-4624-a150-6f11c04e575a:253d8aa0-dd35-40c4-bce1-2a29b4579b93',
    );

    if (storedToken) {
      const storedUser = JSON.parse(storedToken);

      token = {
        accessToken: storedUser.access_token,
        refreshToken: storedUser.refresh_token,
        scope: storedUser.scope,
        expiresAt: storedUser.expires_at,
      };

      cli.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
    }
  }, []);

  return <GraphApiContext.Provider value={{ graphApi, updateAuth }}>{children}</GraphApiContext.Provider>;
};

export const useGraphApi = () => {
  const ctx = useContext(GraphApiContext);

  if (!ctx) {
    throw new Error('useGraphApi must be used inside GraphApiContext');
  }

  return ctx;
};
