import { supabase } from "@/lib/supabase";

export type AnalyticsRange = { from: Date; to: Date };
export type AnalyticsPageDetail = {
  totals: { views: number; visitors: number; avg_seconds: number | null; today: number; this_week: number; this_month: number };
  series: { date: string; views: number; visitors: number }[];
  referrers: { referrer: string | null; views: number }[];
  devices: { device: string; views: number }[];
  browsers: { browser: string; views: number }[];
  operating_systems: { operating_system: string; views: number }[];
};
export type AnalyticsDashboardData = {
  totals: { views: number; visitors: number; sessions: number; returning: number; avg_session_seconds: number; avg_pages_per_session: number; today_views: number; yesterday_views: number; week_views: number; month_views: number; year_views: number; today_visitors: number; month_visitors: number };
  series: { date: string; views: number; visitors: number; new_visitors: number; returning_visitors: number }[];
  pages: { page: string; views: number; visitors: number; avg_seconds: number | null; last_viewed: string }[];
  sources: { source: string; views: number; visitors: number }[];
  devices: { device: string; views: number; visitors: number }[];
  browsers: { browser: string; views: number }[];
  operating_systems: { operating_system: string; views: number }[];
  recent: { page: string; source: string; device: string; viewed_at: string }[];
  bots: { bot_name: string; route: string; request_count: number; first_seen: string; last_seen: string }[];
  sessions: { session_id: string; visitor_id: string; started_at: string; last_activity_at: string; entry_route: string; exit_route: string; device_type: string; browser: string; operating_system: string; source: string; referrer: string | null; journey: { route: string; viewed_at: string }[] }[];
  campaigns: { campaign: string; source: string; medium: string; views: number; visitors: number }[];
  conversions: { event_name: string; events: number; visitors: number }[];
  performance: { metric: string; avg_value: number; samples: number }[];
  geo_available: boolean;
};

const list = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

// Postgres json_agg returns null (not []) when there are no rows, so every list is coerced here.
function normalizeDashboard(raw: unknown): AnalyticsDashboardData {
  const d = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof AnalyticsDashboardData, unknown>>;
  return {
    totals: (d.totals && typeof d.totals === "object" ? d.totals : {}) as AnalyticsDashboardData["totals"],
    series: list(d.series),
    pages: list(d.pages),
    sources: list(d.sources),
    devices: list(d.devices),
    browsers: list(d.browsers),
    operating_systems: list(d.operating_systems),
    recent: list(d.recent),
    bots: list(d.bots),
    sessions: list<AnalyticsDashboardData["sessions"][number]>(d.sessions).map(s => ({ ...s, journey: list(s?.journey) })),
    campaigns: list(d.campaigns),
    conversions: list(d.conversions),
    performance: list(d.performance),
    geo_available: Boolean(d.geo_available),
  };
}

function normalizePageDetail(raw: unknown): AnalyticsPageDetail {
  const d = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof AnalyticsPageDetail, unknown>>;
  return {
    totals: (d.totals && typeof d.totals === "object" ? d.totals : {}) as AnalyticsPageDetail["totals"],
    series: list(d.series),
    referrers: list(d.referrers),
    devices: list(d.devices),
    browsers: list(d.browsers),
    operating_systems: list(d.operating_systems),
  };
}

export async function getAnalyticsDashboard(range: AnalyticsRange) {
  const { data, error } = await supabase.rpc("analytics_dashboard", { p_from: range.from.toISOString(), p_to: range.to.toISOString() });
  return { data: error ? null : normalizeDashboard(data), error };
}

export async function getAnalyticsPage(route: string, range: AnalyticsRange) {
  const { data, error } = await supabase.rpc("analytics_page_detail", { p_route: route, p_from: range.from.toISOString(), p_to: range.to.toISOString() });
  return { data: error ? null : normalizePageDetail(data), error };
}

export async function exportAnalyticsCsv(range: AnalyticsRange): Promise<string> {
  const allRows: Record<string, unknown>[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.rpc("analytics_export", {
      p_from: range.from.toISOString(), p_to: range.to.toISOString(), p_offset: offset, p_limit: pageSize,
    });
    if (error) throw error;
    const rows = (data || []) as Record<string, unknown>[];
    allRows.push(...rows);
    if (rows.length < pageSize) break;
    if (allRows.length >= 25_000) break;
  }
  const fields = ["viewed_at", "route", "page_title", "page_type", "source", "referrer", "device_type", "browser", "operating_system", "duration_seconds", "traffic_class"];
  const cell = (value: unknown) => {
    const text = String(value ?? "").replace(/[\r\n]+/g, " ");
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [fields.map(cell).join(","), ...allRows.map(row => fields.map(field => cell(row[field])).join(","))].join("\r\n");
}
