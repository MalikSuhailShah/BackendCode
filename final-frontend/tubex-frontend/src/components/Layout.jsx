import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { url } from "../lib/api";

const nav = [
  ["/", "Home"],
  ["/tweets", "Tweets"],
  ["/history", "History"],
  ["/liked", "Liked videos"],
  ["/playlists", "Playlists"],
  ["/upload", "Upload"],
  ["/dashboard", "Dashboard"],
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const go = useNavigate();
  const search = (e) => {
    e.preventDefault();
    go(`/?query=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-night/90 px-4 py-3 backdrop-blur">
        <Link
          to="/"
          className="font-display text-2xl font-extrabold tracking-tight"
        >
          tube<span className="text-signal">X</span>
        </Link>
        <form onSubmit={search} className="mx-auto w-full max-w-xl">
          <input
            className="input"
            placeholder="Search videos"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search videos"
          />
        </form>
        <Link to={`/c/${user.username}`} aria-label="Your channel">
          <img
            src={url(user.avatar)}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        </Link>
        <Link
          to="/settings"
          className="hidden text-sm text-mute hover:text-ink sm:inline"
        >
          Settings
        </Link>
        <button className="btn btn-ghost" onClick={logout}>
          Log out
        </button>
      </header>
      <div className="flex">
        <nav className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-52 shrink-0 flex-col gap-1 border-r border-line p-3 md:flex">
          {nav.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-signal/15 text-signal" : "text-mute hover:bg-panel hover:text-ink"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="min-w-0 flex-1 p-4 pb-24 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-line bg-night py-2 md:hidden">
        {nav.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `px-2 text-xs ${isActive ? "text-signal" : "text-mute"}`
            }
          >
            {label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
