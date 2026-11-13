import axios from "axios";

// Backend paths are centralised here and in each page's fetch call. Adjust any that differ from your routes.
// Mount paths of your routers in app.js. Change the VALUES if yours differ (e.g. "/users" -> "/user").
const MOUNT = {
  "/users": "/users",
  "/video": "/video",
  "/likes": "/likes",
  "/subscriptions": "/subscriptions",
  "/tweets": "/tweets",
  "/dashboard": "/dashboard",
  "/comments": "/comments",
  "/playlist": "/playlist",
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((c) => {
  const seg = "/" + (c.url || "").split("/")[1];
  if (MOUNT[seg]) c.url = MOUNT[seg] + c.url.slice(seg.length);
  return c;
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const req = err.config;
    const isAuthCall = /login|refresh-token/.test(req?.url || "");
    if (err.response?.status === 401 && !req._retry && !isAuthCall) {
      req._retry = true;
      try {
        refreshing ??= api
          .post("/users/refresh-token")
          .finally(() => (refreshing = null));
        await refreshing; // one refresh shared by all parallel failed requests
        return api(req);
      } catch {
        window.dispatchEvent(new Event("auth:expired"));
      }
    }
    return Promise.reject(err);
  },
);

// Backend wraps payloads as { data, message }. Unwrap here.
export const get = (u, cfg) => api.get(u, cfg).then((r) => r.data.data);
export const post = (u, b, cfg) => api.post(u, b, cfg).then((r) => r.data.data);
export const patch = (u, b, cfg) =>
  api.patch(u, b, cfg).then((r) => r.data.data);
export const del = (u) => api.delete(u).then((r) => r.data.data);
// Your backend currently returns Express's default HTML error page, so pull the message out of it.
export const errMsg = (e) => {
  const d = e?.response?.data;
  if (d?.message) return d.message;
  if (typeof d === "string") {
    const m = d.match(/<pre>(?:\w*Error: )?(.*?)(?:<br>|<\/pre>)/s);
    if (m) return m[1].trim();
  }
  return e?.message || "Something went wrong";
};
export const list = (d) =>
  Array.isArray(d)
    ? d
    : (d?.videos ?? d?.docs ?? d?.LikedVideos ?? d?.comments ?? []);
export const nameOf = (u) => u?.fullName ?? u?.fullname ?? u?.username ?? "";
export const url = (f) => (typeof f === "string" ? f : f?.url) || ""; // handles string or {url, public_id}
export default api;
