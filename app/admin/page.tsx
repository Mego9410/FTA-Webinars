import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SessionManager } from "@/components/admin/SessionManager";
import { isAdmin, isAdminPreviewMode } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();

  if (!authed) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-fta-warm px-6 py-20">
        <div className="w-full max-w-md space-y-6 rounded-card border border-fta-border bg-fta-bg p-8 text-center shadow-card">
          <h1 className="font-display text-2xl font-bold text-fta-ink">Admin</h1>
          <AdminLoginForm />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      {isAdminPreviewMode() ? (
        <div className="fta-preview-banner border-b-0">
          Admin preview — sessions load from Supabase when configured.
        </div>
      ) : null}
      <SessionManager />
    </main>
  );
}
