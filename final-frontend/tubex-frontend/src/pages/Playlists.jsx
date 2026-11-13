import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, post, del, list } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Empty, ErrorBox } from "../components/ui";

export default function Playlists() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [f, setF] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  useEffect(() => {
    get(`/playlist/user/${user._id}`)
      .then((d) => setItems(list(d)))
      .catch(setError);
  }, [user._id]);

  const create = async (e) => {
    e.preventDefault();
    try {
      const p = await post("/playlist", f);
      setItems((a) => [p, ...a]);
      setF({ name: "", description: "" });
    } catch (err) {
      setError(err);
    }
  };
  const remove = (id) =>
    del(`/playlist/${id}`)
      .then(() => setItems((a) => a.filter((p) => p._id !== id)))
      .catch(setError);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Playlists</h1>
      <form
        onSubmit={create}
        className="my-5 grid gap-2 sm:grid-cols-[1fr_2fr_auto]"
      >
        <input
          className="input"
          placeholder="Name"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Description"
          value={f.description}
          onChange={(e) => setF({ ...f, description: e.target.value })}
          required
        />
        <button className="btn">Create</button>
      </form>
      <ErrorBox error={error} />
      {items?.length === 0 && (
        <Empty
          title="No playlists yet"
          hint="Create one above, then save videos from the watch page."
        />
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {items?.map((p) => (
          <li
            key={p._id}
            className="rounded-xl border border-line bg-panel p-4"
          >
            <Link
              to={`/playlist/${p._id}`}
              className="font-display text-lg font-semibold hover:text-signal"
            >
              {p.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-mute">
              {p.description}
            </p>
            <div className="mt-3 flex items-center justify-between text-sm text-mute">
              <span>{p.videos?.length ?? 0} videos</span>
              <button
                className="hover:text-danger"
                onClick={() => remove(p._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
