import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { get, post, url, list, nameOf } from "../lib/api";
import VideoCard from "../components/VideoCard";
import { Grid, Empty, ErrorBox, Skeletons } from "../components/ui";

export default function Channel() {
  const { username } = useParams();
  const { user } = useAuth();
  const [ch, setCh] = useState(null);
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCh(null);
    setVideos(null);
    get(`/users/c/${username}`)
      .then((c) => {
        setCh(c);
        return get("/video", { params: { userId: c._id, limit: 24 } });
      })
      .then((d) => setVideos(list(d)))
      .catch(setError);
  }, [username]);

  if (error) return <ErrorBox error={error} />;
  if (!ch) return <Skeletons n={4} />;
  const toggle = () =>
    post(`/subscriptions/c/${ch._id}`)
      .then(() =>
        setCh((c) => ({
          ...c,
          isSubscribed: !c.isSubscribed,
          subscribersCount: c.subscribersCount + (c.isSubscribed ? -1 : 1),
        })),
      )
      .catch(setError);

  return (
    <>
      <div className="h-36 overflow-hidden rounded-xl bg-panel sm:h-52">
        {ch.coverImage && (
          <img
            src={url(ch.coverImage)}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <img
          src={url(ch.avatar)}
          alt=""
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="mr-auto">
          <h1 className="font-display text-2xl font-bold">{nameOf(ch)}</h1>
          <p className="text-sm text-mute">
            @{ch.username}, {ch.subscribersCount} subscribers,{" "}
            {ch.channelsSubscribedToCount} following
          </p>
        </div>
        {ch._id !== user._id && (
          <button
            className={`btn ${ch.isSubscribed ? "btn-ghost" : ""}`}
            onClick={toggle}
          >
            {ch.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>
      <div className="mt-8">
        {!videos ? (
          <Skeletons n={4} />
        ) : videos.length ? (
          <Grid>
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </Grid>
        ) : (
          <Empty
            title="No videos yet"
            hint="This channel hasn't published anything."
          />
        )}
      </div>
    </>
  );
}
