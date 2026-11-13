import { useEffect, useState } from "react";
import { get } from "../lib/api";
import VideoCard from "../components/VideoCard";
import { Grid, Empty, ErrorBox, Skeletons } from "../components/ui";

const cfg = {
  history: ["/users/history", "Watch history"],
  liked: ["/likes/videos", "Liked videos"],
};

export default function Library({ kind }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setItems(null);
    get(cfg[kind][0])
      .then((d) =>
        setItems(
          Array.isArray(d)
            ? d.map((x) => x.video ?? x)
            : (d.LikedVideos ?? []).map((l) => l.video).filter(Boolean),
        ),
      )
      .catch(setError);
  }, [kind]);
  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold">{cfg[kind][1]}</h1>
      <ErrorBox error={error} />
      {!items ? (
        <Skeletons n={4} />
      ) : items.length ? (
        <Grid>
          {items.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </Grid>
      ) : (
        <Empty
          title="Nothing here yet"
          hint="Videos you watch or like will show up here."
        />
      )}
    </>
  );
}
