export function PreviewBanner() {
  return (
    <div className="fta-preview-banner" role="status">
      Preview mode — admin is open without a password. Set{" "}
      <code>ADMIN_PASSWORD</code> before production.
    </div>
  );
}
