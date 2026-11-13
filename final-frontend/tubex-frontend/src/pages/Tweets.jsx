import { useEffect, useState } from "react";
import { get, post, patch, del, url, list, nameOf } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ago } from "../components/VideoCard";
import { Empty, ErrorBox } from "../components/ui";

export default function Tweets() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState(null);
  const [text, setText] = useState("");
  const [edit, setEdit] = useState(null);
  const [liked, setLiked] = useState({});
  const [error, setError] = useState(null);

  // Your backend has no global feed, only per-user tweets, so this page shows your own.
  useEffect(() => {
    get(`/tweets/user/${user._id}`)
      .then((d) => setTweets(list(d).slice().reverse()))
      .catch(setError);
  }, [user._id]);

  const add = async (e) => {
    e.preventDefault();
    try {
      const t = await post("/tweets", { content: text });
      setTweets((a) => [t, ...(a ?? [])]);
      setText("");
    } catch (err) {
      setError(err);
    }
  };
  const save = () =>
    patch(`/tweets/${edit.id}`, { content: edit.text })
      .then((t) => {
        setTweets((a) => a.map((x) => (x._id === t._id ? t : x)));
        setEdit(null);
      })
      .catch(setError);
  const remove = (id) =>
    del(`/tweets/${id}`)
      .then(() => setTweets((a) => a.filter((t) => t._id !== id)))
      .catch(setError);
  const like = (id) =>
    post(`/likes/toggle/t/${id}`)
      .then((d) => setLiked((m) => ({ ...m, [id]: d.isLiked })))
      .catch(setError);

  return (
    <div className="max-w-xl">
      <form onSubmit={add} className="mb-6 space-y-2">
        <textarea
          className="input"
          rows={3}
          maxLength={280}
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-mute">{text.length}/280</span>
          <button className="btn" disabled={!text.trim()}>
            Post
          </button>
        </div>
      </form>
      <ErrorBox error={error} />
      {tweets?.length === 0 && (
        <Empty title="No tweets yet" hint="Post your first thought above." />
      )}
      <ul className="divide-y divide-line">
        {tweets?.map((t) => (
          <li key={t._id} className="flex gap-3 py-4">
            <img
              src={url(user.avatar)}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-semibold">{nameOf(user)}</span>{" "}
                <span className="text-mute">
                  @{user.username}, {ago(t.createdAt)}
                </span>
              </p>
              {edit?.id === t._id ? (
                <div className="mt-1 flex gap-2">
                  <textarea
                    className="input"
                    rows={2}
                    value={edit.text}
                    onChange={(e) => setEdit({ ...edit, text: e.target.value })}
                  />
                  <button className="btn" onClick={save}>
                    Save
                  </button>
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap break-words">
                  {t.content}
                </p>
              )}
              <div className="mt-2 flex gap-4 text-sm text-mute">
                <button
                  className={liked[t._id] ? "text-signal" : "hover:text-ink"}
                  onClick={() => like(t._id)}
                >
                  {liked[t._id] ? "Liked" : "Like"}
                </button>
                <button
                  className="hover:text-ink"
                  onClick={() => setEdit({ id: t._id, text: t.content })}
                >
                  Edit
                </button>
                <button
                  className="hover:text-danger"
                  onClick={() => remove(t._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
