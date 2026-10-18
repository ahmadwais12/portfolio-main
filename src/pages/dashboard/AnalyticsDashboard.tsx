import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Download, RefreshCw, ExternalLink, ShieldCheck, Search, BarChart3, Eye, Users, CalendarDays, CalendarClock,
  History, CalendarRange, Calendar, UserCheck, Repeat, Timer, Trophy, Sun, Monitor, Globe2, Share2, Activity,
  Bot, Megaphone, MousePointerClick, Gauge, Route, X, Info, type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAnalyticsDashboard, getAnalyticsPage, exportAnalyticsCsv, type AnalyticsDashboardData, type AnalyticsPageDetail, type AnalyticsRange } from "@/lib/analytics";
import { PUBLIC_PAGES } from "@/analytics/tracker";
import { readSeoSnapshot, scoreSeo, type SeoSnapshot } from "@/analytics/seoAudit";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Preset = "today" | "yesterday" | "7d" | "30d" | "month" | "last-month" | "year" | "custom";
const startDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
function presetRange(preset: Preset): AnalyticsRange {
  const now = new Date(); const today = startDay(now);
  switch (preset) {
    case "today": return { from: today, to: addDays(today, 1) };
    case "yesterday": return { from: addDays(today, -1), to: today };
    case "7d": return { from: addDays(today, -6), to: addDays(today, 1) };
    case "month": return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: addDays(today, 1) };
    case "last-month": return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 1) };
    case "year": return { from: new Date(now.getFullYear(), 0, 1), to: addDays(today, 1) };
    default: return { from: addDays(today, -29), to: addDays(today, 1) };
  }
}
const dateInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const num = (value: unknown) => Number(value || 0).toLocaleString();
const seconds = (value: number) => value < 60 ? `${Math.round(value)}s` : `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`;
const shortDate = (value: unknown) => new Date(String(value)).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const colors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

const axisProps = { tick: { fill: "hsl(var(--muted-foreground))", fontSize: 12 }, tickLine: false, axisLine: { stroke: "hsl(var(--border))" } };
const gridProps = { strokeDasharray: "3 3", stroke: "hsl(var(--border))", vertical: false };
const tooltipProps = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, color: "hsl(var(--popover-foreground))", boxShadow: "0 10px 30px -10px rgb(0 0 0 / 0.35)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
  itemStyle: { color: "hsl(var(--popover-foreground))" },
  cursor: { fill: "hsl(var(--muted) / 0.5)" },
};
const legendProps = { wrapperStyle: { fontSize: 12, color: "hsl(var(--muted-foreground))" } };

function Panel({ title, icon: Icon, action, className, contentClassName, children }: { title: ReactNode; icon?: LucideIcon; action?: ReactNode; className?: string; contentClassName?: string; children: ReactNode }) {
  return (
    <Card className={cn("border-border/60 bg-card/80 shadow-sm backdrop-blur", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-foreground">
          {Icon && <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>}
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

const Empty = ({ children }: { children: ReactNode }) => (
  <div className="flex h-full min-h-24 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-center text-sm text-muted-foreground">{children}</div>
);

const Row = ({ left, right }: { left: ReactNode; right: ReactNode }) => (
  <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 text-sm last:border-0">
    <span className="min-w-0 truncate text-foreground">{left}</span>
    <span className="shrink-0 text-muted-foreground">{right}</span>
  </div>
);

export default function AnalyticsDashboard() {
  const [preset, setPreset] = useState<Preset>("30d");
  const [customFrom, setCustomFrom] = useState(dateInput(presetRange("30d").from));
  const [customTo, setCustomTo] = useState(dateInput(addDays(presetRange("30d").to, -1)));
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [selectedPage, setSelectedPage] = useState("");
  const [pageDetail, setPageDetail] = useState<AnalyticsPageDetail | null>(null);
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<"analytics" | "seo">("analytics");
  const [seoPages, setSeoPages] = useState<(SeoSnapshot | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const range = useMemo(() => preset === "custom" ? { from: new Date(`${customFrom}T00:00:00`), to: addDays(new Date(`${customTo}T00:00:00`), 1) } : presetRange(preset), [preset, customFrom, customTo]);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data: result, error: requestError } = await getAnalyticsDashboard(range);
      if (requestError) { setError(requestError.message); setData(null); }
      else setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load analytics"); setData(null);
    } finally {
      setLoading(false);
    }
  }, [range]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setSeoPages(PUBLIC_PAGES.map(page => readSeoSnapshot(page.path))); }, [section]);
  useEffect(() => {
    const timer = window.setInterval(() => { if (section === "analytics") void load(); }, 30_000);
    return () => window.clearInterval(timer);
  }, [section, load]);

  const choosePage = (route: string) => { setSelectedPage(route); setPageDetail(null); };
  useEffect(() => {
    if (!selectedPage) return;
    let active = true;
    void getAnalyticsPage(selectedPage, range).then(({ data: result, error: requestError }) => {
      if (!active) return;
      if (requestError) toast.error(requestError.message); else setPageDetail(result);
    });
    return () => { active = false; };
  }, [selectedPage, range]);
  const handleExport = async () => {
    try {
      const csv = await exportAnalyticsCsv(range);
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a"); a.href = url; a.download = `portfolio-analytics-${dateInput(range.from)}-to-${dateInput(addDays(range.to, -1))}.csv`; a.click(); URL.revokeObjectURL(url);
      toast.success("Analytics CSV exported");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Unable to export analytics"); }
  };

  const totals = data?.totals;
  const pageName = (route: string) => PUBLIC_PAGES.find(item => item.path === route)?.name || route;
  const filteredPages = (data?.pages ?? []).filter(page => `${page.page} ${pageName(page.page)}`.toLowerCase().includes(search.toLowerCase()));
  const cards: { title: string; value: string; icon: LucideIcon; tone: string }[] = [
    { title: "Views in range", value: num(totals?.views), icon: Eye, tone: "text-cyan-500 bg-cyan-500/10" },
    { title: "Unique visitors", value: num(totals?.visitors), icon: Users, tone: "text-violet-500 bg-violet-500/10" },
    { title: "Today's views", value: num(totals?.today_views), icon: Sun, tone: "text-amber-500 bg-amber-500/10" },
    { title: "Today's visitors", value: num(totals?.today_visitors), icon: UserCheck, tone: "text-emerald-500 bg-emerald-500/10" },
    { title: "Yesterday's views", value: num(totals?.yesterday_views), icon: History, tone: "text-sky-500 bg-sky-500/10" },
    { title: "This week", value: num(totals?.week_views), icon: CalendarDays, tone: "text-indigo-500 bg-indigo-500/10" },
    { title: "This month", value: num(totals?.month_views), icon: CalendarRange, tone: "text-fuchsia-500 bg-fuchsia-500/10" },
    { title: "This year", value: num(totals?.year_views), icon: Calendar, tone: "text-rose-500 bg-rose-500/10" },
    { title: "Visitors this month", value: num(totals?.month_visitors), icon: CalendarClock, tone: "text-teal-500 bg-teal-500/10" },
    { title: "Returning visitors", value: num(totals?.returning), icon: Repeat, tone: "text-orange-500 bg-orange-500/10" },
    { title: "Average session", value: seconds(totals?.avg_session_seconds || 0), icon: Timer, tone: "text-blue-500 bg-blue-500/10" },
    { title: "Most viewed page", value: data?.pages[0] ? pageName(data.pages[0].page) : "—", icon: Trophy, tone: "text-yellow-500 bg-yellow-500/10" },
  ];
  const seoItems = seoPages.map((snapshot, index) => {
    const page = PUBLIC_PAGES[index];
    const checks = snapshot?.checks ?? [];
    const score = snapshot ? scoreSeo(checks) : null;
    return { page, snapshot, checks, score, problems: checks.filter(check => check.status === "ERROR" || check.status === "WARNING") };
  });
  const availableScores = seoItems.map(item => item.score).filter((value): value is number => value !== null);
  const averageSeo = availableScores.length ? Math.round(availableScores.reduce((sum, value) => sum + value, 0) / availableScores.length) : null;
  const scoreTone = (score: number) => score >= 90 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow"><BarChart3 className="h-6 w-6" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Portfolio Analytics</h1>
            <p className="text-sm text-muted-foreground">First-party website usage and technical SEO checks</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-border/60 bg-muted/50 p-1">
            {(["analytics", "seo"] as const).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => { setSection(key); if (key === "seo") setSeoPages(PUBLIC_PAGES.map(page => readSeoSnapshot(page.path))); }}
                className={cn("rounded-lg px-4 py-1.5 text-sm font-medium transition-all", section === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {key === "analytics" ? "Analytics" : "SEO Health"}
              </button>
            ))}
          </div>
          {section === "analytics" && <>
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}><RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />Refresh</Button>
          </>}
        </div>
      </div>

      {section === "analytics" ? <>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 shadow-sm">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground"><CalendarRange className="h-4 w-4 text-primary" />Date range</span>
          <Select value={preset} onValueChange={value => setPreset(value as Preset)}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>
            <SelectItem value="today">Today</SelectItem><SelectItem value="yesterday">Yesterday</SelectItem><SelectItem value="7d">Last 7 days</SelectItem><SelectItem value="30d">Last 30 days</SelectItem><SelectItem value="month">This month</SelectItem><SelectItem value="last-month">Last month</SelectItem><SelectItem value="year">This year</SelectItem><SelectItem value="custom">Custom range</SelectItem>
          </SelectContent></Select>
          {preset === "custom" && <><Input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="w-40" /><span className="text-sm text-muted-foreground">to</span><Input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="w-40" /></>}
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>Auto refresh every 30 seconds</span>
        </div>

        {error && (
          <Card className="border-amber-500/40 bg-amber-500/5">
            <CardContent className="flex gap-3 p-5 text-sm">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <p className="font-semibold text-foreground">Analytics data is unavailable</p>
                <p className="mt-1 text-muted-foreground">{error}. Apply the Supabase migration and set your user's <code className="rounded bg-muted px-1 py-0.5 text-foreground">role</code> to <code className="rounded bg-muted px-1 py-0.5 text-foreground">Super Admin</code> in the <code className="rounded bg-muted px-1 py-0.5 text-foreground">users</code> table.</p>
              </div>
            </CardContent>
          </Card>
        )}
        {loading && !data && !error && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl border border-border/60 bg-muted/40" />)}</div>
        )}

        {data && <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ title, value, icon: Icon, tone }) => (
              <Card key={title} className="group border-border/60 bg-card/80 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <CardContent className="flex items-start justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
                    <p className="mt-2 truncate text-2xl font-bold text-foreground">{value}</p>
                  </div>
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110", tone)}><Icon className="h-5 w-5" /></span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Views and visitors over time" icon={Activity} className="xl:col-span-2" contentClassName="h-72">
              {data.series.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.series}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="date" tickFormatter={shortDate} {...axisProps} />
                    <YAxis allowDecimals={false} {...axisProps} />
                    <Tooltip {...tooltipProps} cursor={{ stroke: "hsl(var(--border))" }} labelFormatter={value => new Date(String(value)).toLocaleDateString()} />
                    <Legend {...legendProps} />
                    <Line type="monotone" dataKey="views" name="Views" stroke={colors[0]} strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="visitors" name="Visitors" stroke={colors[1]} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <Empty>No visits in this range.</Empty>}
            </Panel>
            <Panel title="Devices" icon={Monitor} contentClassName="h-72">
              {data.devices.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.devices} dataKey="views" nameKey="device" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="hsl(var(--card))">
                      {data.devices.map((entry, index) => <Cell key={entry.device} fill={colors[index % colors.length]} />)}
                    </Pie>
                    <Tooltip {...tooltipProps} />
                    <Legend {...legendProps} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <Empty>No visits in this range.</Empty>}
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="New vs returning visitors" icon={Users} contentClassName="h-72">
              {data.series.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.series}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="date" tickFormatter={shortDate} {...axisProps} />
                    <YAxis allowDecimals={false} {...axisProps} />
                    <Tooltip {...tooltipProps} labelFormatter={value => new Date(String(value)).toLocaleDateString()} />
                    <Legend {...legendProps} />
                    <Bar dataKey="new_visitors" name="New" stackId="a" fill={colors[0]} />
                    <Bar dataKey="returning_visitors" name="Returning" stackId="a" fill={colors[1]} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Empty>No visitors in this range.</Empty>}
            </Panel>
            <Panel title="Browsers" icon={Globe2} contentClassName="h-72">
              {data.browsers.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.browsers}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="browser" {...axisProps} />
                    <YAxis allowDecimals={false} {...axisProps} />
                    <Tooltip {...tooltipProps} />
                    <Bar dataKey="views" name="Views" fill={colors[2]} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Empty>No browser data yet.</Empty>}
            </Panel>
            <Panel title="Operating systems" icon={Monitor} contentClassName="h-72 overflow-y-auto">
              {data.operating_systems.length
                ? data.operating_systems.map(item => <Row key={item.operating_system} left={item.operating_system} right={`${num(item.views)} views`} />)
                : <Empty>No operating system data yet.</Empty>}
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Most viewed pages" icon={Trophy} contentClassName="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search URL or page" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {filteredPages.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="py-2 font-medium">Page</th><th className="font-medium">Views</th><th className="font-medium">Visitors</th><th className="font-medium">Avg. time</th></tr></thead>
                    <tbody>
                      {filteredPages.map((page, index) => (
                        <tr key={page.page} className={cn("cursor-pointer border-b border-border/60 text-foreground transition-colors last:border-0 hover:bg-muted/50", selectedPage === page.page && "bg-primary/5")} onClick={() => choosePage(page.page)}>
                          <td className="py-3"><span className="mr-2 text-muted-foreground">{index + 1}.</span>{pageName(page.page)}<div className="text-xs text-muted-foreground">{page.page}</div></td>
                          <td>{num(page.views)}</td><td>{num(page.visitors)}</td><td>{page.avg_seconds ? seconds(page.avg_seconds) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <Empty>{search ? "No pages match your search." : "No page views in this range."}</Empty>}
            </Panel>
            <Panel title="Traffic sources" icon={Share2} contentClassName="h-80">
              {data.sources.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.sources} layout="vertical" margin={{ left: 12 }}>
                    <CartesianGrid {...gridProps} vertical horizontal={false} />
                    <XAxis type="number" allowDecimals={false} {...axisProps} />
                    <YAxis dataKey="source" type="category" width={95} {...axisProps} />
                    <Tooltip {...tooltipProps} />
                    <Bar dataKey="visitors" name="Visitors" fill={colors[0]} radius={[0, 5, 5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Empty>No traffic sources in this range.</Empty>}
            </Panel>
          </div>

          {selectedPage && (
            <Panel
              title={<>Page analytics: <span className="font-mono text-sm text-primary">{selectedPage}</span></>}
              icon={Eye}
              className="border-primary/30"
              action={<Button variant="ghost" size="icon" aria-label="Close page report" onClick={() => { setSelectedPage(""); setPageDetail(null); }}><X className="h-4 w-4" /></Button>}
            >
              {pageDetail ? <>
                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    ["Views", num(pageDetail.totals?.views)],
                    ["Unique visitors", num(pageDetail.totals?.visitors)],
                    ["Average time", pageDetail.totals?.avg_seconds ? seconds(pageDetail.totals.avg_seconds) : "Not available"],
                    ["Views today", num(pageDetail.totals?.today)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pageDetail.series}>
                      <CartesianGrid {...gridProps} />
                      <XAxis dataKey="date" tickFormatter={shortDate} {...axisProps} />
                      <YAxis allowDecimals={false} {...axisProps} />
                      <Tooltip {...tooltipProps} cursor={{ stroke: "hsl(var(--border))" }} />
                      <Line type="monotone" dataKey="views" name="Views" stroke={colors[0]} strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Referrers</h3>
                    {pageDetail.referrers.length ? pageDetail.referrers.map(item => <Row key={item.referrer ?? "direct"} left={item.referrer || "Direct"} right={num(item.views)} />) : <Empty>No referrers.</Empty>}
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Devices</h3>
                    {pageDetail.devices.length ? pageDetail.devices.map(item => <Row key={item.device} left={item.device} right={num(item.views)} />) : <Empty>No device data.</Empty>}
                  </div>
                </div>
              </> : <p className="text-sm text-muted-foreground">Loading page report…</p>}
            </Panel>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Recent activity" icon={Activity}>
              {data.recent.length ? data.recent.map((item, index) => (
                <Row key={`${item.viewed_at}-${index}`} left={<>Opened <strong className="font-semibold">{item.page}</strong><span className="text-muted-foreground"> via {item.source}</span></>} right={<span className="text-xs">{item.device} · {new Date(item.viewed_at).toLocaleString()}</span>} />
              )) : <Empty>No real visits recorded for this date range.</Empty>}
            </Panel>
            <Panel title="Bot / crawler activity" icon={Bot}>
              {data.bots.length ? data.bots.map((bot, index) => (
                <Row key={`${bot.bot_name}-${bot.route}-${index}`} left={`${bot.bot_name} · ${bot.route}`} right={<span className="text-xs">{num(bot.request_count)} · {new Date(bot.last_seen).toLocaleString()}</span>} />
              )) : <Empty>No crawlers recorded in this range.</Empty>}
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="UTM campaigns" icon={Megaphone}>
              {data.campaigns.length ? data.campaigns.map((campaign, index) => (
                <Row key={`${campaign.campaign}-${index}`} left={<>{campaign.campaign}<span className="text-muted-foreground"> · {campaign.source} / {campaign.medium}</span></>} right={`${num(campaign.views)} views · ${num(campaign.visitors)} visitors`} />
              )) : <Empty>No UTM-tagged visits in this range.</Empty>}
            </Panel>
            <Panel title="Tracked events" icon={MousePointerClick}>
              {data.conversions.length ? data.conversions.map(item => (
                <Row key={item.event_name} left={item.event_name} right={`${num(item.events)} events · ${num(item.visitors)} visitors`} />
              )) : <Empty>No tracked events in this range.</Empty>}
            </Panel>
            <Panel title="Browser performance" icon={Gauge}>
              {data.performance.length ? data.performance.map(item => (
                <Row key={item.metric} left={<span className="uppercase">{item.metric}</span>} right={`${item.metric === "cls" ? Number(item.avg_value).toFixed(3) : `${num(item.avg_value)} ms`} avg · ${num(item.samples)} samples`} />
              )) : <Empty>No performance samples in this range.</Empty>}
            </Panel>
          </div>

          <Panel title="Visitor journeys / sessions" icon={Route} contentClassName="space-y-2">
            {data.sessions.length ? data.sessions.map(session => (
              <details key={session.session_id} className="group rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors open:bg-muted/40">
                <summary className="cursor-pointer text-sm text-foreground">
                  <span className="font-medium">{session.entry_route} → {session.exit_route}</span>
                  <span className="ml-2 text-muted-foreground">{new Date(session.started_at).toLocaleString()} · {session.device_type} / {session.browser} · {session.source}</span>
                </summary>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>Session: {session.session_id} · Visitor: {session.visitor_id}</p>
                  <p>Last activity: {new Date(session.last_activity_at).toLocaleString()} · Referrer: {session.referrer || "Direct"}</p>
                  <ol className="mt-2 space-y-1 border-l border-border pl-3">
                    {session.journey.map((step, index) => <li key={`${step.viewed_at}-${index}`}><span className="text-foreground">{step.route}</span> · {new Date(step.viewed_at).toLocaleTimeString()}</li>)}
                  </ol>
                </div>
              </details>
            )) : <Empty>No visitor sessions recorded for this range.</Empty>}
          </Panel>
        </>}
      </> : <>
        <Panel title="SEO Health" icon={ShieldCheck}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/30">
              <span className={cn("text-3xl font-bold", averageSeo === null ? "text-muted-foreground" : scoreTone(averageSeo))}>{averageSeo ?? "—"}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <p className="text-sm text-foreground">Average score across {availableScores.length} of {PUBLIC_PAGES.length} checked pages.</p>
          </div>
        </Panel>
        <Panel title="Page SEO status" icon={Search} contentClassName="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead><tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="py-2 font-medium">Page</th><th className="font-medium">Score</th><th className="font-medium">Errors</th><th className="font-medium">Warnings</th><th className="font-medium">Last checked</th><th /></tr></thead>
            <tbody>
              {seoItems.map(({ page, snapshot, score, problems }) => (
                <tr key={page.path} className="border-b border-border/60 text-foreground last:border-0">
                  <td className="py-3"><strong>{page.name}</strong><div className="text-xs text-muted-foreground">{page.path}</div></td>
                  <td>{score === null ? <Badge variant="outline">NOT CHECKED</Badge> : <span className={cn("font-semibold", scoreTone(score))}>{score}/100</span>}</td>
                  <td className={problems.some(item => item.status === "ERROR") ? "text-rose-500" : undefined}>{problems.filter(item => item.status === "ERROR").length}</td>
                  <td className={problems.some(item => item.status === "WARNING") ? "text-amber-500" : undefined}>{problems.filter(item => item.status === "WARNING").length}</td>
                  <td className="text-muted-foreground">{snapshot ? new Date(snapshot.checkedAt).toLocaleString() : "—"}</td>
                  <td><a href={page.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">Audit <ExternalLink className="h-3 w-3" /></a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        {seoItems.filter(item => item.snapshot).map(({ page, snapshot, checks, score }) => (
          <Panel key={page.path} title={<>{page.name} <span className="font-mono text-xs font-normal text-muted-foreground">{page.path}</span></>} action={score !== null && <span className={cn("text-sm font-semibold", scoreTone(score))}>{score}/100</span>}>
            <p className="mb-3 text-sm text-muted-foreground">Title: {snapshot?.title || "Missing"}; H1: {snapshot?.h1?.join(" / ") || "None"}; H2 count: {snapshot?.h2Count}; Images: {snapshot?.imageCount}, missing alt: {snapshot?.missingAltCount}.</p>
            <div className="grid gap-2 md:grid-cols-2">
              {checks.map(check => (
                <div key={check.name} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm text-foreground">{check.name}</strong>
                    <Badge variant="outline" className={cn(
                      check.status === "PASS" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      check.status === "WARNING" && "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      check.status === "ERROR" && "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
                    )}>{check.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{check.value}</p>
                  <p className="mt-1 text-xs text-foreground/80">{check.explanation}</p>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </>}
    </div>
  );
}
