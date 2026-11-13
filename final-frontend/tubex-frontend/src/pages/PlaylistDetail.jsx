import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, patch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import { Grid, Empty, ErrorBox, Skeletons } from "../components/ui";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const [pl, setPl] = useState(null);
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);

  // getPlaylistById returns video ids only, so fetch each video.
  useEffect(() => {
    get(`/playlist/${playlistId}`)
      .then(async (p) => {
        setPl(p);
        const vs = await Promise.all(
          (p.videos ?? []).map((id) => get(`/video/${id}`).catch(() => null)),
        );
        setVideos(vs.filter(Boolean));
      })
      .catch(setError);
  }, [playlistId]);

  const remove = (vid) =>
    patch(`/playlist/remove/${vid}/${playlistId}`)
      .then(() => setVideos((a) => a.filter((v) => v._id !== vid)))
      .catch(setError);
  if (error) return <ErrorBox error={error} />;
  if (!pl) return <Skeletons n={4} />;
  const mine = String(pl.owner) === user._id;

  return (
    <>
      <h1 className="font-display text-2xl font-bold">{pl.name}</h1>
      <p className="mb-6 mt-1 text-mute">{pl.description}</p>
      {!videos ? (
        <Skeletons n={4} />
      ) : videos.length ? (
        <Grid>
          {videos.map((v) => (
            <div key={v._id}>
              <VideoCard video={v} />
              {mine && (
                <button
                  className="mt-1 text-sm text-mute hover:text-danger"
                  onClick={() => remove(v._id)}
                >
                  Remove from playlist
                </button>
              )}
            </div>
          ))}
        </Grid>
      ) : (
        <Empty
          title="This playlist is empty"
          hint="Use Save on any video to add it here."
        />
      )}
    </>
  );
}
