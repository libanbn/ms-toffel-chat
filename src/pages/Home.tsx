import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGraphApi } from '../hooks/GraphApi';
import { ChatMessage, Chatroom, User } from '../types/';
import DOMPurify from 'dompurify';
import { userImg, gearImg, keyImg } from '../assets';

import { dateToHoursAndMinutes } from '../utils/date';
import { OidcProvider } from '../services/oidc';
import { useEvents } from '../hooks/';
import { EventType } from '../hooks/EventBus';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr);
  gap: 4px;

  & > * {
    max-height: max-height: calc(var(--innerHeight) - 32px);
    grid-auto-rows: minmax(min-content, max-content);
  }
`;

export const Home: React.FC = () => {
  const { graphApi } = useGraphApi();
  const { login, logout } = useContext(OidcProvider);
  const { notify, subscribe } = useEvents();

  const [chatrooms, setChatrooms] = useState<Chatroom[]>();
  const [chatRoomMessages, setChatRoomMessages] = useState<ChatMessage[]>();
  const { chatId } = useParams<{ chatId: string }>();
  const [messageInput, setMessageInput] = useState<string>('');

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
      <Wrapper className="window content">
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 20px',
            height: 'calc(100vh - 54px)',
            gap: '4px',
            alignContent: 'stretch',
          }}>
          <ul className="tree-view" style={{ overflow: 'scroll' }}>
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
          <div className="status-bar" style={{ gap: '4px' }}>
            <button
              className="status-bar-field"
              onClick={login}
              style={{ height: '20px', width: '20px', minWidth: '20px', flexGrow: '0' }}>
              <img src={userImg} alt="User" height="100%" />
            </button>
            <button
              onClick={logout}
              className="status-bar-field"
              style={{ height: '20px', width: '20px', minWidth: '20px', flexGrow: '0' }}>
              <img src={keyImg} alt="User" height="100%" />
            </button>
            <div style={{ flex: 1 }} />
            <button
              className="status-bar-field"
              style={{ height: '20px', width: '20px', minWidth: '20px', flexGrow: '0' }}>
              <img src={gearImg} alt="User" height="100%" />
            </button>

            <button
              onClick={() => {
                notify({ eventType: EventType.BTN_CLICKED, payload: {} });
              }}>
              x
            </button>
          </div>
        </div>

        <div className="content" style={{ display: 'grid', gap: '4px', gridTemplateRows: '1rem auto 2rem' }}>
          <div className="status-bar">
            <p className="status-bar-field">#{chat?.topic}</p>
          </div>
          <pre style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
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

          <div style={{ display: 'grid', gap: '4px', gridTemplateColumns: '19fr 1fr' }}>
            <input type="text" onChange={(e) => setMessageInput(e.target.value)} value={messageInput} />
            <button style={{ height: '20px' }} onClick={sendMessage}>
              SEND
            </button>
          </div>
        </div>

        <ul className="tree-view chat-member-list" style={{ overflowY: 'scroll' }}>
          {chat?.users?.map((c) => (
            <li key={c.id}>
              <Link to="#">{c.username}</Link>
            </li>
          ))}
        </ul>
      </Wrapper>
    </>
  );
};
