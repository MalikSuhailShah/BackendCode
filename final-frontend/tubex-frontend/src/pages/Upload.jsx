import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../lib/api";
import { ErrorBox } from "../components/ui";

export default function Upload() {
  const go = useNavigate();
  const [pct, setPct] = useState(0);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // field names must match the route: video, thumbnail, title, description
      const v = await post("/video", new FormData(e.target), {
        onUploadProgress: (p) => setPct(Math.round((p.loaded / p.total) * 100)),
      });
      go(`/watch/${v._id}`);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      <h1 className="font-display text-2xl font-bold">Upload a video</h1>
      <ErrorBox error={error} />
      <input className="input" name="title" placeholder="Title" required />
      <textarea
        className="input"
        name="description"
        rows={4}
        placeholder="Description"
        required
      />
      <label className="block text-sm text-mute">
        Video file
        <input
          className="input mt-1"
          name="video"
          type="file"
          accept="video/*"
          required
        />
      </label>
      <label className="block text-sm text-mute">
        Thumbnail
        <input
          className="input mt-1"
          name="thumbnail"
          type="file"
          accept="image/*"
          required
        />
      </label>
      {busy && (
        <div className="h-2 overflow-hidden rounded bg-panel">
          <div
            className="h-full bg-signal transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <button className="btn" disabled={busy}>
        {busy ? (pct < 100 ? `Uploading ${pct}%` : "Processing…") : "Publish"}
      </button>
    </form>
  );
}
