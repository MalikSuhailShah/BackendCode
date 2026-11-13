import { useState } from "react";
import { get, patch, list } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ErrorBox } from "./ui";

export default function SaveToPlaylist({ videoId }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [pls, setPls] = useState(null);
  const [error, setError] = useState(null);

  const toggleOpen = () => {
    setOpen(!open);
    if (!pls)
      get(`/playlist/user/${user._id}`)
        .then((d) => setPls(list(d)))
        .catch(setError);
  };
  const has = (p) => p.videos?.some((id) => String(id?._id ?? id) === videoId);
  const toggle = async (p) => {
    try {
      const updated = await patch(
        `/playlist/${has(p) ? "remove" : "add"}/${videoId}/${p._id}`,
      );
      setPls((a) => a.map((x) => (x._id === p._id ? updated : x)));
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div className="relative">
      <button
        className="btn btn-ghost"
        onClick={toggleOpen}
        aria-expanded={open}
      >
        Save
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-2 w-64 rounded-xl border border-line bg-panel p-3 shadow-xl">
          <ErrorBox error={error} />
          {!pls ? (
            <p className="text-sm text-mute">Loading…</p>
          ) : pls.length === 0 ? (
            <p className="text-sm text-mute">
              No playlists yet. Create one on the Playlists page.
            </p>
          ) : (
            <ul className="space-y-1">
              {pls.map((p) => (
                <li key={p._id}>
                  <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-line">
                    <input
                      type="checkbox"
                      checked={!!has(p)}
                      onChange={() => toggle(p)}
                    />
                    {p.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
