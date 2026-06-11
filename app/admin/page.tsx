import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SessionManager } from "@/components/admin/SessionManager";
import { isAdmin, isAdminPreviewMode } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();

  if (!authed) {
    return (
      <main className="fta-section flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-extrabold text-[var(--fg-1)]">Admin</h1>
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
