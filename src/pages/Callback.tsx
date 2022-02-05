import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { OidcProvider } from '../services/oidc';
import { GraphApiProvider } from '../services/graph';

export const Callback: React.FC = () => {
  const {mgr: oidc} = useContext(OidcProvider);
  const { updateAuth } = useContext(GraphApiProvider);
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
