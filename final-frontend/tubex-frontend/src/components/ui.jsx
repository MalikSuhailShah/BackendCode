import { errMsg } from "../lib/api";
export const Grid = ({ children }) => (
  <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {children}
  </div>
);
export const Empty = ({ title, hint }) => (
  <div className="py-20 text-center">
    <p className="font-display text-xl font-semibold">{title}</p>
    <p className="mt-1 text-sm text-mute">{hint}</p>
  </div>
);
export const ErrorBox = ({ error }) =>
  error ? (
    <p
      role="alert"
      className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
    >
      {errMsg(error)}
    </p>
  ) : null;
export const Skeletons = ({ n = 8 }) => (
  <Grid>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-video rounded-xl bg-panel" />
        <div className="mt-3 h-4 w-3/4 rounded bg-panel" />
        <div className="mt-2 h-3 w-1/2 rounded bg-panel" />
      </div>
    ))}
  </Grid>
);
