import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get, post, patch, del, url, list } from "../lib/api";
import { ErrorBox } from "../components/ui";

// getChannelStats returns { totalVideos, totalViews, totalSubcribers (sic), totalLikes }
const stat = (s, k) =>
  s ? (s[k] ?? (k === "totalSubscribers" ? s.totalSubcribers : 0) ?? 0) : "–";
const cards = [
  ["totalVideos", "Videos"],
  ["totalViews", "Views"],
  ["totalSubscribers", "Subscribers"],
  ["totalLikes", "Likes on videos"],
];

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [videos, setVideos] = useState(null);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    get("/dashboard/stats").then(setS).catch(setError);
    get("/dashboard/videos")
      .then((d) => setVideos(list(d)))
      .catch(setError);
  }, []);

  const togglePub = (id) =>
    patch(`/video/toggle/publish/${id}`)
      .then((d) =>
        setVideos((a) =>
          a.map((v) =>
            v._id === id ? { ...v, isPublished: d.isPublished } : v,
          ),
        ),
      )
      .catch(setError);
  const remove = (id) =>
    confirm("Delete this video permanently?") &&
    del(`/video/${id}`)
      .then(() => setVideos((a) => a.filter((v) => v._id !== id)))
      .catch(setError);
  const save = () =>
    patch(`/video/${edit._id}`, {
      title: edit.title,
      description: edit.description,
    })
      .then((v) => {
        setVideos((a) => a.map((x) => (x._id === v._id ? { ...x, ...v } : x)));
        setEdit(null);
      })
      .catch(setError);

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold">Your channel</h1>
      <ErrorBox error={error} />
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([k, label]) => (
          <div key={k} className="rounded-xl border border-line bg-panel p-5">
            <dt className="text-sm text-mute">{label}</dt>
            <dd className="mt-1 font-display text-3xl font-extrabold">
              {stat(s, k)}
            </dd>
          </div>
        ))}
      </dl>
      <h2 className="mb-3 mt-10 font-display text-lg font-bold">
        Manage videos
      </h2>
      {videos?.length === 0 && (
        <p className="text-sm text-mute">
          You haven't uploaded anything yet.{" "}
          <Link to="/upload" className="text-signal">
            Upload a video
          </Link>
        </p>
      )}
      <ul className="divide-y divide-line">
        {videos?.map((v) => (
          <li key={v._id} className="flex flex-wrap items-center gap-4 py-3">
            <img
              src={url(v.thumbnail)}
              alt=""
              className="h-16 w-28 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              {edit?._id === v._id ? (
                <div className="space-y-2">
                  <input
                    className="input"
                    value={edit.title}
                    onChange={(e) =>
                      setEdit({ ...edit, title: e.target.value })
                    }
                  />
                  <textarea
                    className="input"
                    rows={2}
                    value={edit.description}
                    onChange={(e) =>
                      setEdit({ ...edit, description: e.target.value })
                    }
                  />
                </div>
              ) : (
                <>
                  <Link
                    to={`/watch/${v._id}`}
                    className="font-semibold hover:text-signal"
                  >
                    {v.title}
                  </Link>
                  <p className="text-sm text-mute">{v.views ?? 0} views</p>
                </>
              )}
            </div>
            <button
              className={`btn btn-ghost ${v.isPublished ? "text-mint" : "text-mute"}`}
              onClick={() => togglePub(v._id)}
            >
              {v.isPublished ? "Published" : "Unpublished"}
            </button>
            {edit?._id === v._id ? (
              <button className="btn" onClick={save}>
                Save
              </button>
            ) : (
              <button className="btn btn-ghost" onClick={() => setEdit(v)}>
                Edit
              </button>
            )}
            <button
              className="btn btn-ghost hover:text-danger"
              onClick={() => remove(v._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
