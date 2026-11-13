import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { get, post } from "../lib/api";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get("/users/current-user")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const expire = () => setUser(null);

    window.addEventListener("auth:expired", expire);
    return () => window.removeEventListener("auth:expired", expire);
  }, []);

  const login = useCallback(async (identifier, password) => {
    const body = identifier.includes("@")
      ? { email: identifier, password }
      : { username: identifier, password };
    const d = await post("/users/login", body);
    setUser(d.user);
  }, []);
  const refresh = useCallback(
    () => get("/users/current-user").then(setUser),
    [],
  );
  const logout = useCallback(async () => {
    await post("/users/logout").catch(() => {});
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}
