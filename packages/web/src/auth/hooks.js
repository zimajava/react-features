import { useCallback, useContext, useMemo, useState } from 'react';

import { AuthActionsContext, AuthStateContext, AuthUserContext } from './AuthProvider';

export function useAuthState() {
  return useContext(AuthStateContext);
}

export function useAuthActions() {
  return useContext(AuthActionsContext);
}

export function useAuthUser() {
  return useContext(AuthUserContext);
}

export function useLogin(credentialsConf = ['username', 'password']) {
  const [credentials, setCredentials] = useState({});
  const { loginError, loginLoading } = useAuthState();
  const { login } = useAuthActions();

  const loginWithCredentials = useCallback(() => login(credentials), [login, credentials]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      loginWithCredentials();
    },
    [loginWithCredentials],
  );

  const valuesProps = useMemo(() => {
    return credentialsConf.reduce(
      (out, name) => ({
        ...out,
        [name]: {
          value: credentials[name] === undefined ? '' : credentials[name],
        },
      }),
      {},
    );
  }, [credentials, credentialsConf]);

  const onChangesProps = useMemo(() => {
    return credentialsConf.reduce(
      (out, name) => ({
        ...out,
        [name]: {
          // TODO: check for no event simply string....
          onChange: (e) => {
            setCredentials((cred) => ({ ...cred, [name]: e.target.value }));
          },
        },
      }),
      {},
    );
  }, [setCredentials, credentialsConf]);

  const credentialsProps = useMemo(() => {
    return Object.keys(valuesProps).reduce(
      (r, name) => ({
        ...r,
        [name]: {
          ...valuesProps[name],
          ...onChangesProps[name],
        },
      }),
      {},
    );
  }, [valuesProps, onChangesProps]);

  console.log({
    valuesProps,
    onChangesProps,
    credentialsProps,
  });

  return {
    handleSubmit,
    login: loginWithCredentials,
    loginError,
    loginLoading,
    ...credentialsProps,
  };
}
