import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ErrorBox } from "../components/ui";

export default function Login() {
  const { user, login } = useAuth();
  const go = useNavigate();
  const [f, setF] = useState({ id: "", pw: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(f.id, f.pw);
      go("/");
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-4xl font-extrabold">
          tube<span className="text-signal">X</span>
        </h1>
        <p className="text-mute">Log in to watch, post and follow channels.</p>
        <ErrorBox error={error} />
        <input
          className="input"
          placeholder="Username or email"
          value={f.id}
          onChange={(e) => setF({ ...f, id: e.target.value })}
          required
          autoComplete="username"
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={f.pw}
          onChange={(e) => setF({ ...f, pw: e.target.value })}
          required
          autoComplete="current-password"
        />
        <button className="btn w-full" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
        <p className="text-sm text-mute">
          New here?{" "}
          <Link to="/register" className="text-signal">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
