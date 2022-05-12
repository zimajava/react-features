import axios from 'axios';

import config from '../config';

const request = (token, sessionId) =>
  axios.create({
    baseURL: `${config.apiBase}${config.apiSuffix}`,
    timeout: config.requestTimeout,
    headers: {
      Authorization: `Bearer ${token}`,
      'X-CSRF-Token': `${sessionId}`,
    },
  });

export const serverApi = ({ token = null, sessionId = null } = {}) => ({
  // for autologin
  updateValidToken() {
    return request(token, sessionId).get('updateValidToken');
  },
  userBySessionId(sid) {
    return request(token, sid).get('userBySessionId', {
      params: {
        sessionId: sid,
      },
    });
  },
  sessionId() {
    return request(token, sessionId).get('sessionId');
  },
  googleConfig() {
    return request(token, sessionId).get('googleConfig');
  },
  register(record) {
    return request(token, sessionId).post('register', record);
  },
  login(record) {
    return request(token, sessionId).post('logon', record);
  },
  delete(record) {
    return request(token, sessionId).post('delete', record);
  },
  createBot(record, token2) {
    return request(token2, sessionId).post('configs', record);
  },
  updateBot(record, token2) {
    return request(token2, sessionId).post('configs/update', record);
  },
  getAllBots(token2) {
    return request(token2, sessionId).get('configs');
  },
});
