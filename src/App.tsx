import { useContext, useState } from 'react';
import { OidcProvider } from './services/oidc';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Callback } from './pages/Callback';
import { GraphApiProvider } from './services/graph';
import { ControlPanel } from './pages/ControlPanel';
import { Home } from './pages/Home';
import { User } from './types/User';

import { useEffect } from 'react';
import { app, window as tauriWindow } from '@tauri-apps/api';

export default function App() {
  const mgr = useContext(OidcProvider);
  const graph = useContext(GraphApiProvider);

  const [me, setMe] = useState<User>();

  useEffect(() => {
    graph.graphApi.me().then(setMe);

    const resize = () => {
      document.documentElement.style.setProperty('--innerWidth', `${window.innerWidth | 0}px`);
      document.documentElement.style.setProperty('--innerHeight', `100vh`);
    };
    window.onresize = resize;
    window.onload = resize;
  }, []);

  return (
    <OidcProvider.Provider value={mgr}>
      <GraphApiProvider.Provider value={graph}>
        <div className="window">
          <div className="title-bar">
            <div className="title-bar-text">Toffel Chat - {me?.displayName}</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close" onClick={() => tauriWindow.appWindow.close()}></button>
            </div>
          </div>
          <BrowserRouter>
            <Switch>
              <Route path="/callback" component={Callback} />
              <Route path="/control" component={ControlPanel} />
              <Route path="/chat/:chatId" component={Home} />
              <Route exact path="/chat" component={Home} />
              <Route path="/" component={Home} />
            </Switch>
          </BrowserRouter>
        </div>
      </GraphApiProvider.Provider>
    </OidcProvider.Provider>
  );
}
