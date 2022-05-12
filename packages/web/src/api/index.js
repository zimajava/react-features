/* eslint-disable no-return-await */
import { serverApi } from './serverApi';

export const loginCall = (params) => {
  // const auth = JSON.parse(localStorage.getItem('auth'));
  // console.log('loginCall', auth);
  // eslint-disable-next-line camelcase
  const token = serverApi()
    .login(params)
    .then((res) => res.data)
    .catch(console.error);

  console.log('loginCall', token);

  return new Promise(
    (resolve) => resolve(token),
    // TODO Remove mock
    // resolve({
    //   accessToken: 'token ? token.access_token : null',
    //   expires: 14400,
    // }),
  );
};

// request for user account
export const meCall = (/* token */) => {
  // const SessionId = JSON.parse(sessionStorage.getItem('SessionId'));
  // console.log('SessionId', SessionId);
  // const user = serverApi({ token })
  //   .userBySessionId(SessionId)
  //   .then((res) => res.data)
  //   .catch((e) => {
  //     console.error(e);
  //     return {};
  //   });
  return new Promise((resolve) => resolve({}));
  // return new Promise((resolve) => resolve(user));
};
