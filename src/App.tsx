import { useContext } from 'react';
import { OidcProvider } from './services/oidc';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Callback } from './pages/Callback';
import { GraphApi } from './hooks/GraphApi';
import { ControlPanel } from './pages/ControlPanel';
import { Home } from './pages/Home';
import { EventBus } from './hooks/EventBus';
import { Logger } from './hooks/Logger';

import { useEffect } from 'react';
import { app, window as tauriWindow } from '@tauri-apps/api';

export default function App() {
  const oidc = useContext(OidcProvider);

  useEffect(() => {
    const resize = () => {
      document.documentElement.style.setProperty('--innerWidth', `${window.innerWidth | 0}px`);
      document.documentElement.style.setProperty('--innerHeight', `100vh`);
    };
    window.onresize = resize;
    window.onload = resize;
  }, []);

  return (
    <Logger>
      <EventBus>
        <OidcProvider.Provider value={oidc}>
          <GraphApi>
            <div className="window">
              <div className="title-bar">
                <div className="title-bar-text">Toffel Chat</div>
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

              <div className="status-bar">
                <p className="status-bar-field">test</p>
              </div>
            </div>
          </GraphApi>
        </OidcProvider.Provider>
      </EventBus>
    </Logger>
  );
}
