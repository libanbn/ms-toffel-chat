import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { OidcProvider } from '../services/oidc';
import { useGraphApi } from '../hooks/GraphApi';

export const Callback: React.FC = () => {
  const { mgr: oidc } = useContext(OidcProvider);
  const { updateAuth } = useGraphApi();
  const history = useHistory();

  useEffect(() => {
    oidc
      .signinRedirectCallback()
      .then(updateAuth)
      .then(() => history.push('/chat'))
      .catch(function (err) {});
  });

  return <></>;
};
