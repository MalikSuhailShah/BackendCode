import { useState } from "react";
import { patch, post } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ErrorBox } from "../components/ui";

// Matches: PATCH /users/update-account, /users/avatar (field "avatar"), /users/cover-image (field "coverImage"), POST /users/change-password
export default function Settings() {
  const { user, refresh } = useAuth();
  const [error, setError] = useState(null);
  const [ok, setOk] = useState("");

  const run = (fn, msg) => async (e) => {
    e.preventDefault();
    setError(null);
    setOk("");
    const form = e.target;
    try {
      await fn(new FormData(form));
      await refresh();
      form.reset();
      setOk(msg);
    } catch (err) {
      setError(err);
    }
  };
  const Section = ({ title, children, onSubmit }) => (
    <form onSubmit={onSubmit} className="space-y-3 border-b border-line pb-8">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {children}
      <button className="btn">Save</button>
    </form>
  );

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="font-display text-2xl font-bold">Settings</h1>
      <ErrorBox error={error} />
      {ok && (
        <p
          role="status"
          className="rounded-lg border border-mint/40 bg-mint/10 px-3 py-2 text-sm text-mint"
        >
          {ok}
        </p>
      )}
      <Section
        title="Account details"
        onSubmit={run(
          (f) =>
            patch("/users/update-account", {
              fullName: f.get("fullName"),
              email: f.get("email"),
            }),
          "Account details saved",
        )}
      >
        <input
          className="input"
          name="fullName"
          defaultValue={user.fullName}
          placeholder="Full name"
          required
        />
        <input
          className="input"
          name="email"
          type="email"
          defaultValue={user.email}
          placeholder="Email"
          required
        />
      </Section>
      <Section
        title="Avatar"
        onSubmit={run((f) => patch("/users/avatar", f), "Avatar updated")}
      >
        <input
          className="input"
          name="avatar"
          type="file"
          accept="image/*"
          required
        />
      </Section>
      <Section
        title="Cover image"
        onSubmit={run(
          (f) => patch("/users/cover-image", f),
          "Cover image updated",
        )}
      >
        <input
          className="input"
          name="coverImage"
          type="file"
          accept="image/*"
          required
        />
      </Section>
      <Section
        title="Change password"
        onSubmit={run(
          (f) =>
            post("/users/change-password", {
              oldPassword: f.get("oldPassword"),
              newPassword: f.get("newPassword"),
            }),
          "Password changed",
        )}
      >
        <input
          className="input"
          name="oldPassword"
          type="password"
          placeholder="Current password"
          required
          autoComplete="current-password"
        />
        <input
          className="input"
          name="newPassword"
          type="password"
          placeholder="New password"
          required
          autoComplete="new-password"
        />
      </Section>
    </div>
  );
}
