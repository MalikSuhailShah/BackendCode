import { Link } from "react-router-dom";
import { url } from "../lib/api";

export const fmtDuration = (s = 0) => {
  s = Math.round(s);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
export const ago = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  for (const [n, u] of [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ])
    if (s >= n) {
      const v = Math.floor(s / n);
      return `${v} ${u}${v > 1 ? "s" : ""} ago`;
    }
  return "just now";
};

export default function VideoCard({ video }) {
  const o = video.owner;
  return (
    <article>
      <Link to={`/watch/${video._id}`} className="group block">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-panel">
          <img
            src={url(video.thumbnail)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          />
          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs">
            {fmtDuration(video.duration)}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-display text-base font-semibold leading-snug">
          {video.title}
        </h3>
      </Link>
      <p className="mt-1 text-sm text-mute">
        {o?.username && (
          <Link to={`/c/${o.username}`} className="hover:text-ink">
            {o.username}
          </Link>
        )}{" "}
        {video.views ?? 0} views, {ago(video.createdAt)}
      </p>
    </article>
  );
}
