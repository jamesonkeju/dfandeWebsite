import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/admin/auth/authSlice";
import { useGetAnalyticsSummaryQuery } from "@/features/analytics/api/analyticsApi";
import {
  Activity,
  Users,
  Eye,
  Clock,
  FileText,
} from "lucide-react";

const TIMEFRAMES = [
  { value: 7, label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 90, label: "Last 90 Days" },
];

export function AnalyticsPage() {
  const [days, setDays] = useState<number>(30);
  const { token } = useSelector(selectAuth);
  const { data: analytics, isLoading } = useGetAnalyticsSummaryQuery(days);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const res = await fetch(`/api/analytics/export?days=${days}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DFANDE_Visitor_Analytics_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download analytics report.");
    } finally {
      setIsExporting(false);
    }
  };

  const maxTrend = Math.max(
    ...(analytics?.trafficTrends.map((t) => t.pageViews) || [10]),
    1
  );

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold-dark border border-gold/30">
              <Activity size={18} />
            </div>
            <h1 className="text-2xl font-bold text-ink">Site Visitation &amp; Traffic Intelligence</h1>
          </div>
          <p className="mt-1 text-xs text-steel">
            Real-time tracking of public visitor traffic, corporate page discovery, and audience demographics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center rounded-full border border-line bg-white p-1 shadow-2xs">
            {TIMEFRAMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setDays(t.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  days === t.value
                    ? "bg-gold text-gold-ink shadow-xs"
                    : "text-steel hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Export Report button */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-full bg-void px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-void-raised transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Exporting…</span>
              </>
            ) : (
              <>
                <FileText size={15} className="text-gold" />
                <span>Export Detailed Report (.csv)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center text-xs text-steel">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold-dark border-t-transparent" />
            <span>Loading traffic analytics…</span>
          </div>
        </div>
      )}

      {analytics && (
        <>
          {/* TOP KPI CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-steel">Total Page Views</span>
                <div className="rounded-xl bg-gold/15 p-2 text-gold-dark">
                  <Eye size={18} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-ink">
                {analytics.totalPageViews.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-steel border-t border-line/60 pt-2">
                <span>Today: <strong className="text-ink font-mono">{analytics.todayPageViews}</strong></span>
                <span>Last 7 Days: <strong className="text-ink font-mono">{analytics.last7DaysViews}</strong></span>
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-steel">Unique Visitors</span>
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-600">
                  <Users size={18} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-ink">
                {analytics.totalUniqueVisitors.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-steel border-t border-line/60 pt-2">
                <span>Today Uniques: <strong className="text-ink font-mono">{analytics.todayUniqueVisitors}</strong></span>
                <span>Active Sessions</span>
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-steel">Avg Session Duration</span>
                <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600">
                  <Clock size={18} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-ink">
                {analytics.avgDurationSeconds > 0 ? `${analytics.avgDurationSeconds}s` : "< 1 min"}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-steel border-t border-line/60 pt-2">
                <span>Engaged Visitor Dwell Time</span>
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-steel">Monthly Volume</span>
                <div className="rounded-xl bg-purple-500/15 p-2 text-purple-600">
                  <Activity size={18} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold font-mono text-ink">
                {analytics.last30DaysViews.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs text-steel border-t border-line/60 pt-2">
                <span>Last 30-Day Window</span>
              </div>
            </div>
          </div>

          {/* TRAFFIC TRENDS VISUAL CHART */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Daily Visitation Trends</h3>
                <p className="text-xs text-steel">Page views and unique visitor traffic over the selected timeframe</p>
              </div>
              <span className="text-xs font-mono text-steel">Scale: Max {maxTrend} hits/day</span>
            </div>

            {analytics.trafficTrends.length > 0 ? (
              <div className="h-48 flex items-end gap-2 pt-6 overflow-x-auto pb-2">
                {analytics.trafficTrends.map((point) => {
                  const heightPercent = Math.max(8, Math.round((point.pageViews / maxTrend) * 100));
                  return (
                    <div key={point.date} className="flex-1 min-w-[32px] flex flex-col items-center gap-2 group">
                      <div className="w-full relative flex items-end justify-center h-36 bg-paper rounded-lg p-1">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full rounded-md bg-gradient-to-t from-gold-dark to-gold transition-all duration-300 group-hover:from-gold group-hover:to-gold-light"
                        />
                        <div className="absolute -top-7 hidden group-hover:flex rounded bg-void px-2 py-1 text-[10px] font-mono text-white whitespace-nowrap z-10 shadow-md">
                          {point.pageViews} views ({point.uniqueVisitors} unique)
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-steel truncate max-w-full">
                        {point.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-steel">
                No recorded visits in this timeframe yet. Traffic will display as visitors navigate the public site.
              </div>
            )}
          </div>

          {/* 2-COLUMN BREAKDOWN: TOP PAGES & AUDIENCE DEMOGRAPHICS */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Top Pages */}
            <div className="lg:col-span-7 rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Most Visited Pages &amp; Services</h3>
                <span className="text-xs text-steel">Ranked by volume</span>
              </div>

              {analytics.topPages.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topPages.map((page, idx) => (
                    <div key={page.path} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-ink flex items-center gap-2 truncate max-w-[70%]">
                          <span className="text-steel font-normal">#{idx + 1}</span>
                          <span className="truncate">{page.path}</span>
                        </span>
                        <div className="flex items-center gap-3 text-steel">
                          <span className="font-mono font-bold text-ink">{page.views} views</span>
                          <span className="text-[11px] font-mono">({page.percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-paper">
                        <div
                          style={{ width: `${page.percentage}%` }}
                          className="h-full rounded-full bg-gold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-steel">No page views recorded yet.</p>
              )}
            </div>

            {/* Right: Device & Browser Distribution */}
            <div className="lg:col-span-5 space-y-6">
              {/* Device Types */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3">
                  Device Distribution
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {analytics.deviceBreakdown.map((device) => (
                    <div key={device.name} className="rounded-2xl border border-line bg-paper p-3 text-center space-y-1">
                      <div className="flex justify-center text-gold-dark font-bold text-xs uppercase">
                        {device.name}
                      </div>
                      <p className="text-xs font-bold text-ink">{device.name}</p>
                      <p className="text-sm font-mono font-bold text-gold-dark">{device.percentage}%</p>
                      <p className="text-[10px] text-steel">{device.count} hits</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referrers */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-2">
                  Top Traffic Sources
                </h3>
                {analytics.referrerBreakdown.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.referrerBreakdown.map((ref) => (
                      <div key={ref.name} className="flex items-center justify-between text-xs border-b border-line/50 pb-1.5">
                        <span className="font-semibold text-ink truncate max-w-[65%]">{ref.name}</span>
                        <span className="font-mono text-steel">{ref.count} ({ref.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-steel py-2">Direct navigational visits predominate.</p>
                )}
              </div>
            </div>
          </div>

          {/* RECENT VISITOR ACTIVITY LOG */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Recent Real-Time Visits</h3>
                <p className="text-xs text-steel">Live stream of incoming page visits</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-paper text-[11px] font-bold uppercase tracking-wider text-ink">
                  <tr>
                    <th className="px-4 py-3">Timestamp (UTC)</th>
                    <th className="px-4 py-3">Page Visited</th>
                    <th className="px-4 py-3">Device &amp; OS</th>
                    <th className="px-4 py-3">Browser</th>
                    <th className="px-4 py-3">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {analytics.recentVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-paper/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-steel whitespace-nowrap">
                        {new Date(v.timestampUtc).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-bold text-ink whitespace-nowrap">
                        {v.path}
                      </td>
                      <td className="px-4 py-3 text-steel whitespace-nowrap">
                        <span className="rounded bg-paper px-2 py-0.5 font-semibold text-ink">
                          {v.deviceType} • {v.operatingSystem}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-steel whitespace-nowrap">{v.browser}</td>
                      <td className="px-4 py-3 text-steel max-w-[180px] truncate">{v.referrer || "Direct"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
