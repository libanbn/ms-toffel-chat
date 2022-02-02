import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { GraphApiProvider } from '../services/graph';
import { ChatMessage } from '../types/ChatMessage';
import { Chatroom } from '../types/Chatroom';
import { User } from '../types/User';
import DOMPurify from 'dompurify';

import { dateToHoursAndMinutes } from '../utils/date';
import { authenticate } from '../services/oidc';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr);
  gap: 4px;
`;

export const Home: React.FC = () => {
  const { graphApi } = useContext(GraphApiProvider);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>();
  const [chatRoomMessages, setChatRoomMessages] = useState<ChatMessage[]>();
  const { chatId } = useParams<{ chatId: string }>();

  // Current selected chat
  const chat = useMemo(() => {
    if (chatId && chatrooms) {
      return chatrooms.find((room) => room.id === chatId);
    }
  }, [chatId, chatrooms]);

  const allUsers = useMemo(() => {
    var users = new Array<User>();

    chatrooms?.forEach((room) => {
      room?.users?.forEach((user) => users.push(user));
    });

    return users;
  }, [chatrooms]);

  // Fetch all chats for user
  useEffect(() => {
    graphApi.chats().then(setChatrooms);
  }, []);

  // Get selected chat data
  useEffect(() => {
    if (chatId) graphApi.chatMessages(chatId).then(setChatRoomMessages);
  }, [chatId]);

  // To send messages
  const [messageInput, setMessageInput] = useState<string>('');

  const sendMessage = useCallback(() => {
    if (chat && messageInput) {
      setMessageInput('');

      graphApi.sendChatMessage(chat.id, {
        body: {
          content: messageInput,
        },
      } as ChatMessage);
    }
  }, [messageInput]);

  return (
    <>
      <Wrapper className="window">
        <div>
          <ul className="tree-view" style={{ height: 'calc(var(--innerHeight, 100vh) - 4rem)', overflow: 'scroll' }}>
            <li>
              <details open>
                <summary>Recent</summary>
                <ul>
                  {chatrooms?.map((c, i) => (
                    <li key={c.id}>
                      {i % 5 == 0 ? (
                        <img
                          src="https://win98icons.alexmeub.com/icons/png/trust1_restrict-0.png"
                          width="12"
                          height="12"
                          style={{ padding: '2px' }}
                        />
                      ) : (
                        <img
                          src="https://win98icons.alexmeub.com/icons/png/trust0-0.png"
                          width="12"
                          height="12"
                          style={{ padding: '2px' }}
                        />
                      )}
                      <Link to={`/chat/${c.id}`}>{c.topic}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>

          <div className="status-bar">
            <div className="title-bar-controls">
              <button aria-label="Close" style={{ padding: '1rem' }} onClick={authenticate}></button>
            </div>
          </div>
        </div>

        <div className="field-row-stacked" style={{height: 'calc(var(--innerHeight) - 36px)', display: 'grid', gridTemplateRows: '1rem auto 2rem' }}>
          <div className="status-bar">
            <p className="status-bar-field">#{chat?.topic}</p>
          </div>
          <pre style={{ height: '100%', overflowY: 'scroll', overflowX: 'hidden' }}>
            {chatRoomMessages?.map((msg, i) => (
              <div className="chat-message" key={i}>
                <span>[{dateToHoursAndMinutes(msg.createdDateTime)}] </span>
                <span style={{ display: 'inline-block', width: '150px' }}>
                  &lt;
                  {allUsers.find((user) => user.id === msg.from?.user?.id)?.username ?? msg.from?.user.displayName}
                  &gt; &nbsp;
                </span>
                <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.body.content) }} />
              </div>
            ))}
          </pre>

          <div style={{ display: 'grid', gridTemplateColumns: '19fr 1fr' }}>
            <input type="text" onChange={(e) => setMessageInput(e.target.value)} value={messageInput} />
            <button onClick={sendMessage}>SEND</button>
          </div>
        </div>

        <div style={{ maxHeight: 'var(--innerHeight, 100vh)' }}>
          <ul className="tree-view" style={{ height: '100%', overflowY: 'scroll' }}>
            {chat?.users?.map((c) => (
              <li key={c.id}>
                <Link to="#">{c.username}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Wrapper>
    </>
  );
};
