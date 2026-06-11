export function PreviewBanner() {
  return (
    <div className="fta-preview-banner" role="status">
      Preview mode — admin is open without a password. Set{" "}
      <code className="rounded bg-white/60 px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code>{" "}
      before production.
    </div>
  );
}
