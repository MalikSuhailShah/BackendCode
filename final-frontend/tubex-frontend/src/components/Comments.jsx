import { useEffect, useState } from "react";
import { get, post, patch, del, url, list, nameOf } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ago } from "./VideoCard";
import { ErrorBox } from "./ui";

const idOf = (x) => String(x?._id ?? x ?? "");

export default function Comments({ videoId }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null); // { id, text }
  const [liked, setLiked] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [videoId]);
  useEffect(() => {
    get(`/comments/${videoId}`, { params: { page, limit: 10 } })
      .then((d) => {
        setItems((c) => (page === 1 ? list(d) : [...c, ...list(d)]));
        setPages(d?.pagination?.totalPages ?? 1);
      })
      .catch(setError);
  }, [videoId, page]);

  const add = async (e) => {
    e.preventDefault();
    try {
      const c = await post(`/comments/${videoId}`, { content: text.trim() });
      setItems((a) => [{ ...c, owner: user }, ...a]);
      setText("");
    } catch (err) {
      setError(err);
    }
  };
  const save = async () => {
    try {
      await patch(`/comments/c/${editing.id}`, {
        content: editing.text.trim(),
      });
      setItems((a) =>
        a.map((c) =>
          c._id === editing.id ? { ...c, content: editing.text.trim() } : c,
        ),
      );
      setEditing(null);
    } catch (err) {
      setError(err);
    }
  };
  const remove = (id) =>
    del(`/comments/c/${id}`)
      .then(() => setItems((a) => a.filter((c) => c._id !== id)))
      .catch(setError);
  const like = (id) =>
    post(`/likes/toggle/c/${id}`)
      .then((d) => setLiked((m) => ({ ...m, [id]: d.isLiked })))
      .catch(setError);

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-bold">Comments</h2>
      <form onSubmit={add} className="mt-3 flex gap-3">
        <img
          src={url(user.avatar)}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
        <input
          className="input"
          placeholder="Add a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn" disabled={!text.trim()}>
          Comment
        </button>
      </form>
      <div className="mt-3">
        <ErrorBox error={error} />
      </div>
      {items.length === 0 && (
        <p className="py-8 text-center text-sm text-mute">
          No comments yet. Start the conversation.
        </p>
      )}
      <ul className="mt-4 space-y-5">
        {items.map((c) => {
          const o = typeof c.owner === "object" ? c.owner : null; // unpopulated owner arrives as a plain id
          const mine = idOf(c.owner) === user._id;
          return (
            <li key={c._id} className="flex gap-3">
              {o?.avatar ? (
                <img
                  src={url(o.avatar)}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-panel" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">
                    {o ? `@${o.username}` : "User"}
                  </span>{" "}
                  <span className="text-mute">{ago(c.createdAt)}</span>
                </p>
                {editing?.id === c._id ? (
                  <div className="mt-1 flex gap-2">
                    <input
                      className="input"
                      value={editing.text}
                      onChange={(e) =>
                        setEditing({ ...editing, text: e.target.value })
                      }
                    />
                    <button className="btn" onClick={save}>
                      Save
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">
                    {c.content}
                  </p>
                )}
                <div className="mt-1 flex gap-4 text-xs text-mute">
                  <button
                    className={liked[c._id] ? "text-signal" : "hover:text-ink"}
                    onClick={() => like(c._id)}
                    aria-pressed={!!liked[c._id]}
                  >
                    {liked[c._id] ? "Liked" : "Like"}
                  </button>
                  {mine && (
                    <>
                      <button
                        className="hover:text-ink"
                        onClick={() =>
                          setEditing({ id: c._id, text: c.content })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="hover:text-danger"
                        onClick={() => remove(c._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {page < pages && (
        <div className="mt-6 text-center">
          <button
            className="btn btn-ghost"
            onClick={() => setPage((p) => p + 1)}
          >
            Show more comments
          </button>
        </div>
      )}
    </section>
  );
}
