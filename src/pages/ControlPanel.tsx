import { useContext, useState } from 'react';
import { GraphApiProvider } from '../services/graph';
import { authenticate, OidcProvider } from '../services/oidc';

export const ControlPanel: React.FC = () => {
  const mgr = useContext(OidcProvider);
  const { graphApi } = useContext(GraphApiProvider);

  const [data, setData] = useState<string>('');
  const [input, setInput] = useState<string>('');

  return (
    <>
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <button onClick={authenticate}>Init</button>
      <button onClick={async () => setData(JSON.stringify(await graphApi.me()))}>Print info about me</button>
      <button onClick={async () => setData(JSON.stringify(await graphApi.chats()))}>Get my chats</button>
      <button onClick={async () => setData(JSON.stringify(await graphApi.chatMessages(input)))}>
        Get my chats messages
      </button>

      <button onClick={async () => setData(JSON.stringify(await graphApi.myPrecense()))}>Get my presence</button>

      <button onClick={async () => await mgr.signoutRedirect()}>Sign out</button>

      <div style={{ margin: '5rem' }}>{data}</div>
    </>
  );
};
