import { useContext, useState } from 'react';
import { useGraphApi } from '../hooks/GraphApi';
import { OidcProvider } from '../services/oidc';

export const ControlPanel: React.FC = () => {
  const { graphApi } = useGraphApi();

  const [data, setData] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const { login, logout } = useContext(OidcProvider);

  return (
    <>
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <button onClick={login}>Init</button>
      <button onClick={async () => setData(JSON.stringify(await graphApi.me()))}>Print info about me</button>
      <button onClick={async () => setData(JSON.stringify(await graphApi.chats()))}>Get my chats</button>
      <button onClick={async () => setData(JSON.stringify(await graphApi.chatMessages(input)))}>
        Get my chats messages
      </button>

      <button onClick={async () => setData(JSON.stringify(await graphApi.myPrecense()))}>Get my presence</button>

      <button onClick={logout}>Sign out</button>

      <div style={{ margin: '5rem' }}>{data}</div>
    </>
  );
};
