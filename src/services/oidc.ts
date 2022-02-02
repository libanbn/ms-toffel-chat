import Oidc from 'oidc-client';
import 'babel-polyfill';
import { createContext } from 'react';

var mgr = new Oidc.UserManager({
  userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
  authority: process.env.REACT_APP_OIDC_AUTHORITY,
  client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
  redirect_uri: window.location.origin + '/callback',
  response_type: 'code',
  scope: 'Channel.ReadBasic.All Chat.Read User.Read ChannelMessage.Send',
  post_logout_redirect_uri: window.location.origin,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTime: 60,
  filterProtocolClaims: true,
  loadUserInfo: false,
  extraQueryParams: {
    resource: 'https://graph.microsoft.com',
    requested_token_use: 'on_behalf_of',
  },
});

export const OidcProvider = createContext(mgr);

export const authenticate = async () => {
  await mgr.signinRedirect();
};
