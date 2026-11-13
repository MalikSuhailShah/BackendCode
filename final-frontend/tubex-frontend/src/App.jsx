import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Watch = lazy(() => import("./pages/Watch"));
const Upload = lazy(() => import("./pages/Upload"));
const Library = lazy(() => import("./pages/Library"));
const Channel = lazy(() => import("./pages/Channel"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Playlists = lazy(() => import("./pages/Playlists"));
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const Tweets = lazy(() => import("./pages/Tweets"));

function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-mute">Loading…</p>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Suspense fallback={<p className="p-8 text-mute">Loading…</p>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Protected />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="watch/:videoId" element={<Watch />} />
            <Route path="upload" element={<Upload />} />
            <Route path="history" element={<Library kind="history" />} />
            <Route path="liked" element={<Library kind="liked" />} />
            <Route path="c/:username" element={<Channel />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="tweets" element={<Tweets />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
