import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get, post, url, list } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ago } from "../components/VideoCard";
import { ErrorBox } from "../components/ui";
import Comments from "../components/Comments";
import SaveToPlaylist from "../components/SaveToPlaylist";

const idOf = (x) => String(x?._id ?? x ?? "");

export default function Watch() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [v, setV] = useState(null);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    setV(null);
    setError(null);
    get(`/video/${videoId}`).then(setV).catch(setError);
  }, [videoId]);

  // Initial like / subscribe state, derived from the list endpoints you already have.
  const ownerId = idOf(v?.owner);
  useEffect(() => {
    if (!v) return;
    get("/likes/videos")
      .then((d) => setLiked(list(d).some((x) => idOf(x.video ?? x) === v._id)))
      .catch(() => {});
    if (ownerId && ownerId !== user._id)
      get(`/subscriptions/c/${ownerId}`)
        .then((d) =>
          setSubbed(list(d).some((s) => idOf(s.subscriber) === user._id)),
        )
        .catch(() => {});
  }, [v?._id]); // eslint-disable-line

  if (error && !v) return <ErrorBox error={error} />;
  if (!v)
    return (
      <div className="aspect-video max-w-5xl animate-pulse rounded-xl bg-panel" />
    );
  const o = typeof v.owner === "object" ? v.owner : null; // getVideoById may return just the owner id
  const like = () =>
    post(`/likes/toggle/v/${v._id}`)
      .then((d) => setLiked(d.isLiked))
      .catch(setError);
  const sub = () =>
    post(`/subscriptions/c/${ownerId}`)
      .then(() => setSubbed((s) => !s))
      .catch(setError);

  return (
    <div className="max-w-5xl">
      <video
        src={url(v.videoFile)}
        poster={url(v.thumbnail)}
        controls
        autoPlay
        className="aspect-video w-full rounded-xl bg-black"
      />
      <h1 className="mt-4 font-display text-2xl font-bold">{v.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {o?.username && (
          <Link to={`/c/${o.username}`} className="font-semibold">
            {o.username}
          </Link>
        )}
        {ownerId && ownerId !== user._id && (
          <button className={`btn ${subbed ? "btn-ghost" : ""}`} onClick={sub}>
            {subbed ? "Subscribed" : "Subscribe"}
          </button>
        )}
        <SaveToPlaylist videoId={v._id} />
        <button
          className={`btn btn-ghost ${liked ? "text-signal" : ""}`}
          onClick={like}
          aria-pressed={liked}
        >
          {liked ? "Liked" : "Like"}
        </button>
      </div>
      <ErrorBox error={error} />
      <div className="mt-4 rounded-xl bg-panel p-4 text-sm">
        <p className="font-medium">
          {v.views ?? 0} views, {ago(v.createdAt)}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-mute">{v.description}</p>
      </div>
      <Comments videoId={v._id} />
    </div>
  );
}
