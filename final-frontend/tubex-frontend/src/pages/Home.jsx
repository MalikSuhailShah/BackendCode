import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { get, list } from "../lib/api";
import VideoCard from "../components/VideoCard";
import { Grid, Empty, ErrorBox, Skeletons } from "../components/ui";

export default function Home() {
  const [sp] = useSearchParams();
  const query = sp.get("query") || "";
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [query]);
  useEffect(() => {
    setLoading(true);
    get("/video", { params: { page, limit: 12, query } })
      .then((d) => {
        const l = list(d);
        setVideos((v) => (page === 1 ? l : [...v, ...l]));
        setPages(d?.pagination?.totalPages ?? d?.totalPages ?? 1);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page, query]);

  return (
    <>
      <ErrorBox error={error} />
      {loading && !videos.length ? (
        <Skeletons />
      ) : videos.length ? (
        <Grid>
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </Grid>
      ) : (
        <Empty
          title={query ? `No videos match "${query}"` : "No videos yet"}
          hint="Try a different search, or upload the first one."
        />
      )}
      {page < pages && (
        <div className="mt-8 text-center">
          <button
            className="btn btn-ghost"
            disabled={loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
