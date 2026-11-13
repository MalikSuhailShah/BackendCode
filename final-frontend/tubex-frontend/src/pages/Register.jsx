import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../lib/api";
import { ErrorBox } from "../components/ui";

export default function Register() {
  const go = useNavigate();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post("/users/register", new FormData(e.target));
      go("/login");
    } catch (err) {
      // keys: fullName, username, email, password, avatar, coverImage
      setError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3">
        <h1 className="font-display text-3xl font-extrabold">
          Create your account
        </h1>
        <ErrorBox error={error} />
        <input
          className="input"
          name="fullName"
          placeholder="Full name"
          required
        />
        <input
          className="input"
          name="username"
          placeholder="Username"
          required
        />
        <input
          className="input"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          required
          autoComplete="new-password"
        />
        <label className="block text-sm text-mute">
          Avatar (required)
          <input
            className="input mt-1"
            name="avatar"
            type="file"
            accept="image/*"
            required
          />
        </label>
        <label className="block text-sm text-mute">
          Cover image (optional)
          <input
            className="input mt-1"
            name="coverImage"
            type="file"
            accept="image/*"
          />
        </label>
        <button className="btn w-full" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="text-sm text-mute">
          Have an account?{" "}
          <Link to="/login" className="text-signal">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
