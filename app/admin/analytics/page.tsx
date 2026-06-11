import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { isAdmin } from "@/lib/admin";
import {
  getDashboardSummary,
  getEmailFunnel,
  getJoinHistogram,
  getRetentionCurve,
  getSessionMetricsList,
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ from?: string; to?: string; session?: string }>;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const authed = await isAdmin();
  if (!authed) {
    return (
      <main className="fta-section flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-extrabold text-[var(--fg-1)]">Analytics</h1>
          <AdminLoginForm />
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const to = params.to ? new Date(params.to) : new Date();
  const from = params.from
    ? new Date(params.from)
    : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

  const range = {
    from: from.toISOString(),
    to: new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString(),
  };

  const [summary, sessions] = await Promise.all([
    getDashboardSummary(range),
    getSessionMetricsList(range),
  ]);

  const selectedSessionId = params.session ?? sessions[0]?.id ?? null;
  const retention = selectedSessionId
    ? await getRetentionCurve(selectedSessionId)
    : [];
  const joinHistogram = selectedSessionId
    ? await getJoinHistogram(selectedSessionId)
    : [];
  const emailFunnel = selectedSessionId
    ? await getEmailFunnel(selectedSessionId)
    : { sent: 0, delivered: 0, opened: 0, clicked: 0 };

  return (
    <main className="flex flex-1 flex-col">
      <AnalyticsDashboard
        summary={summary}
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        retention={retention}
        joinHistogram={joinHistogram}
        emailFunnel={emailFunnel}
        defaultFrom={range.from}
        defaultTo={range.to}
      />
    </main>
  );
}
