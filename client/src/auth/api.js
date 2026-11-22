// API client with automatic access-token refresh.
//
// - The access token lives only in this module's memory (never localStorage),
//   so XSS can't read it from storage and it disappears when the tab closes.
// - The refresh token is an HttpOnly cookie that JavaScript can never see;
//   the browser attaches it to /api/auth/* requests automatically.
// - When a request gets a 401, we refresh once and retry it.
// - Refreshes are serialized across ALL tabs with the Web Locks API. The
//   server rotates the refresh token on every use and treats re-use of an
//   old one as theft, so two tabs refreshing at the same instant would
//   otherwise log you out.

import axios from 'axios';

let accessToken = null;
let onSessionExpired = () => {};

export function setAccessToken(token) {
  accessToken = token;
}

export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn;
}

export const api = axios.create({ withCredentials: true });

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let inflight = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** POST /refresh, waiting and retrying if the server says "slow down" (429)
 *  rather than treating it as a lost session. */
async function postRefresh(attempt = 0) {
  try {
    return await axios.post('/api/auth/refresh', null, { withCredentials: true });
  } catch (err) {
    if (err.response?.status === 429 && attempt < 2) {
      const wait = Number(err.response.headers?.['retry-after']) || 2;
      await sleep(Math.min(wait, 10) * 1000);
      return postRefresh(attempt + 1);
    }
    throw err;
  }
}

/** Exchange the refresh cookie for a new access token. Resolves to the
 *  server's TokenResponse ({ access_token, user, ... }). */
export function refreshSession() {
  if (!inflight) {
    const run = () => postRefresh();
    const locked = navigator.locks?.request
      ? navigator.locks.request('auth-refresh', run)
      : run();
    inflight = locked
      .then((res) => {
        accessToken = res.data.access_token;
        return res.data;
      })
      .catch((err) => {
        accessToken = null;
        throw err;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    const isAuthCall = config?.url?.startsWith('/api/auth/');
    if (response?.status !== 401 || !config || config._retried || isAuthCall) {
      throw error;
    }
    config._retried = true;
    try {
      await refreshSession();
    } catch {
      onSessionExpired();
      throw error;
    }
    return api(config);
  },
);

/** Turn an axios error into a message suitable for showing to the user. */
export function errorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err?.response) return "Couldn't reach the server. Check your connection and try again.";
  const detail = err.response.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length) {
    // FastAPI validation errors: [{ loc: [..., field], msg }]
    const { loc, msg } = detail[0];
    const field = loc?.[loc.length - 1];
    return field && field !== 'body' ? `${field.replace('_', ' ')}: ${msg}` : msg;
  }
  return fallback;
}
