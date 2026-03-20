import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Shield, AlertTriangle, Activity, Users, TrendingUp, TrendingDown,
  DollarSign, Eye, Zap, Brain, Settings, Bell, Search, ChevronRight,
  MapPin, Clock, ArrowUpRight, ArrowDownRight, Flame, Wifi, CloudRain,
  BarChart3, CheckCircle2, XCircle, Flag, RefreshCw, Sliders, ArrowLeft
} from "lucide-react";
import {
  adminKPIs, payoutTrend, disruptionsByType, zoneRiskGrid, recentClaims,
  fraudAlerts, reliabilityDistribution, platformActivityFeed, aiInsights,
  pricingParams, liveDisruptionAlerts
} from "@/lib/mockAdminData";

// ============================================================
// TYPES
// ============================================================
type AdminSection = "overview" | "zones" | "claims" | "fraud" | "platform" | "ai" | "pricing";

// ============================================================
// HELPERS & MICRO COMPONENTS
// ============================================================
function fmt(n: number, prefix = "") {
  if (n >= 10000000) return prefix + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return prefix + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return prefix + (n / 1000).toFixed(1) + "K";
  return prefix + n.toLocaleString();
}

function KpiCard({
  label, value, sub, trend, trendUp, icon: Icon, accent = false,
}: {
  label: string; value: string; sub?: string; trend?: string; trendUp?: boolean;
  icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`admin-card p-4 flex flex-col gap-3 ${accent ? "border-[hsl(173,58%,35%)/40]" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="admin-text-muted text-xs font-medium uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-[hsl(173,58%,45%)/20]" : "bg-white/5"}`}>
          <Icon className={`w-4 h-4 ${accent ? "text-emerald-400" : "text-slate-400"}`} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-black admin-text tabular-nums">{value}</p>
        {sub && <p className="text-xs admin-text-muted mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
          {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {trend} vs last week
        </div>
      )}
    </div>
  );
}

function SeverityBadge({ level }: { level: "critical" | "high" | "medium" | "low" }) {
  const cfg = {
    critical: "badge-critical",
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  };
  return <span className={cfg[level]}>{level.charAt(0).toUpperCase() + level.slice(1)}</span>;
}

function RiskBadge({ level }: { level: "high" | "medium" | "low" }) {
  const cfg = {
    high: "text-red-400 bg-red-500/10 border border-red-500/20",
    medium: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
    low: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </span>
  );
}

function StatusBadge({ status }: { status: "auto_approved" | "flagged" }) {
  if (status === "auto_approved") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Auto-approved
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
      <Flag className="w-3 h-3" /> Flagged
    </span>
  );
}

function AdminTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="admin-card px-3 py-2.5 text-xs shadow-xl min-w-[120px]">
      <p className="admin-text-muted font-medium mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="admin-text font-semibold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.value > 1000 ? fmt(p.value, "₹") : p.value}
        </p>
      ))}
    </div>
  );
}

// ============================================================
// SECTIONS
// ============================================================
function OverviewSection({ liveAlertCount }: { liveAlertCount: number }) {
  const LOSS_COLORS = ["#2CB67D", "#ef4444"];
  const lossData = [
    { name: "Premiums", value: 271500 },
    { name: "Payouts", value: 168330 },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active Riders" value={fmt(adminKPIs.totalActiveRiders)} sub="Across 6 cities" trend="+8.2%" trendUp icon={Users} accent />
        <KpiCard label="Active Policies" value={fmt(adminKPIs.activePoliciesThisWeek)} sub="This week" trend="+5.1%" trendUp icon={Shield} />
        <KpiCard label="Payouts Triggered" value={fmt(adminKPIs.totalPayoutsTriggered)} sub="This month" trend="+12.4%" trendUp icon={Zap} />
        <KpiCard label="Loss Ratio" value={(adminKPIs.lossRatio * 100).toFixed(0) + "%"} sub="62% (threshold: 70%)" trend="-2.1%" trendUp icon={TrendingDown} />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Payout Trend */}
        <div className="admin-card p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="admin-text font-semibold text-sm">Payout Trend</h3>
              <p className="admin-text-muted text-xs">Daily payouts vs premiums</p>
            </div>
            <span className="text-xs admin-text-muted">Mar 1–15</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payoutTrend} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPremiums" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2CB67D" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2CB67D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPayouts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(210,20%,55%)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<AdminTooltip />} />
                <Area type="monotone" dataKey="premiums" stroke="#2CB67D" fill="url(#gPremiums)" strokeWidth={1.5} name="Premiums" dot={false} />
                <Area type="monotone" dataKey="amount" stroke="#ef4444" fill="url(#gPayouts)" strokeWidth={1.5} name="Payouts" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loss Ratio */}
        <div className="admin-card p-4">
          <h3 className="admin-text font-semibold text-sm mb-1">Premium vs Payout</h3>
          <p className="admin-text-muted text-xs mb-4">This week</p>
          <div className="h-36 flex items-center justify-center">
            <PieChart width={160} height={144}>
              <Pie data={lossData} cx={75} cy={66} innerRadius={44} outerRadius={66} dataKey="value" strokeWidth={0}>
                {lossData.map((_, i) => <Cell key={i} fill={LOSS_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => fmt(v, "₹")} contentStyle={{ background: "hsl(222,40%,9%)", border: "1px solid hsl(222,30%,18%)", borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </div>
          <div className="space-y-1.5">
            {lossData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: LOSS_COLORS[i] }} />
                  <span className="admin-text-muted">{d.name}</span>
                </div>
                <span className="admin-text font-semibold tabular-nums">{fmt(d.value, "₹")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disruptions by Type */}
      <div className="admin-card p-4">
        <h3 className="admin-text font-semibold text-sm mb-4">Disruptions by Type — This Month</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={disruptionsByType} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize: 10, fill: "hsl(210,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(210,20%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<AdminTooltip />} />
              <Bar dataKey="count" name="Events" radius={[4, 4, 0, 0]}>
                {disruptionsByType.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Alerts */}
      <div className="admin-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="admin-text font-semibold text-sm flex items-center gap-2">
            <span className="live-dot" /> Live Disruption Alerts
          </h3>
          <span className="badge-critical">{liveAlertCount} active</span>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {liveDisruptionAlerts.map(alert => (
            <div key={alert.id} className={`p-3 rounded-xl border flex items-start gap-3 ${
              alert.severity === "critical" ? "border-red-500/20 bg-red-500/5" :
              alert.severity === "high" ? "border-amber-500/20 bg-amber-500/5" : "border-blue-500/20 bg-blue-500/5"
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                alert.type === "rain" ? "bg-blue-500/20" :
                alert.type === "platform" ? "bg-red-500/20" : "bg-amber-500/20"
              }`}>
                {alert.type === "rain" ? <CloudRain className="w-3.5 h-3.5 text-blue-400" /> :
                 alert.type === "platform" ? <Wifi className="w-3.5 h-3.5 text-red-400" /> :
                 <Flame className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold admin-text truncate">{alert.zone}</p>
                  <SeverityBadge level={alert.severity} />
                </div>
                <p className="text-[10px] admin-text-muted">{alert.message}</p>
                <p className="text-[10px] admin-text-muted mt-0.5">{alert.ridersAffected} riders affected • {alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ZonesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = zoneRiskGrid.filter(z =>
    z.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 admin-text-muted" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search zones or cities…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm admin-surface-2 admin-text border-0 focus:outline-none focus:ring-2 ring-emerald-500/30 placeholder:admin-text-muted"
            style={{ background: "hsl(222,35%,12%)", color: "hsl(210,40%,95%)" }}
          />
        </div>
        <button className="admin-surface-2 px-3 py-2.5 rounded-xl text-xs font-semibold admin-text flex items-center gap-1.5 border-0" style={{ background: "hsl(222,35%,12%)" }}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs admin-text-muted">
        {[
          { color: "bg-red-500/80", label: "High Risk" },
          { color: "bg-amber-500/80", label: "Medium Risk" },
          { color: "bg-emerald-500/80", label: "Low Risk" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Zone Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(zone => (
          <div key={zone.zone} className={`admin-card p-4 border ${
            zone.riskLevel === "high" ? "border-red-500/20" :
            zone.riskLevel === "medium" ? "border-amber-500/20" : "border-emerald-500/20"
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin className="w-3 h-3 admin-text-muted" />
                  <p className="text-sm font-bold admin-text">{zone.zone}</p>
                </div>
                <p className="text-xs admin-text-muted">{zone.city}</p>
              </div>
              <RiskBadge level={zone.riskLevel} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className={`text-lg font-black tabular-nums ${
                  zone.riskLevel === "high" ? "text-red-400" :
                  zone.riskLevel === "medium" ? "text-amber-400" : "text-emerald-400"
                }`}>{zone.riskScore}</p>
                <p className="text-[9px] admin-text-muted">Risk Score</p>
              </div>
              <div>
                <p className="text-lg font-black admin-text tabular-nums">{zone.activeRiders}</p>
                <p className="text-[9px] admin-text-muted">Riders</p>
              </div>
              <div>
                <p className={`text-lg font-black tabular-nums ${
                  zone.disruptionLikelihood > 70 ? "text-red-400" :
                  zone.disruptionLikelihood > 50 ? "text-amber-400" : "text-emerald-400"
                }`}>{zone.disruptionLikelihood}%</p>
                <p className="text-[9px] admin-text-muted">Disruption</p>
              </div>
            </div>

            {/* Risk bar */}
            <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                zone.riskLevel === "high" ? "bg-red-500" :
                zone.riskLevel === "medium" ? "bg-amber-500" : "bg-emerald-500"
              }`} style={{ width: `${zone.riskScore}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClaimsSection() {
  const [filter, setFilter] = useState<"all" | "auto_approved" | "flagged">("all");
  const filtered = filter === "all" ? recentClaims : recentClaims.filter(c => c.status === filter);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "auto_approved", "flagged"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "admin-text-muted hover:admin-text"
            }`}
            style={{ color: filter !== f ? "hsl(210,20%,55%)" : undefined }}
          >
            {f === "all" ? "All Claims" : f === "auto_approved" ? "Auto-Approved" : "Flagged"}
          </button>
        ))}
      </div>

      {/* Claims Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto admin-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(222,30%,18%)" }}>
                {["Claim ID", "Rider", "Zone", "Expected", "Actual", "Payout", "Reason", "Status", "Time"].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-semibold uppercase tracking-wide" style={{ color: "hsl(210,20%,45%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b transition-colors hover:bg-white/2"
                  style={{ borderColor: "hsl(222,30%,14%)", cursor: "pointer" }}
                >
                  <td className="px-3 py-3 font-mono" style={{ color: "hsl(210,40%,80%)" }}>{c.id}</td>
                  <td className="px-3 py-3 font-mono" style={{ color: "hsl(210,20%,55%)" }}>{c.riderId}</td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="font-semibold" style={{ color: "hsl(210,40%,90%)" }}>{c.zone}</p>
                      <p style={{ color: "hsl(210,20%,45%)", fontSize: "10px" }}>{c.city}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3 tabular-nums font-medium" style={{ color: "hsl(210,40%,75%)" }}>₹{c.expectedEarnings.toLocaleString()}</td>
                  <td className="px-3 py-3 tabular-nums font-medium text-red-400">₹{c.actualEarnings.toLocaleString()}</td>
                  <td className="px-3 py-3 tabular-nums font-bold text-emerald-400">₹{c.payoutAmount.toLocaleString()}</td>
                  <td className="px-3 py-3" style={{ color: "hsl(210,20%,60%)" }}>{c.triggerReason}</td>
                  <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-3 py-3 whitespace-nowrap" style={{ color: "hsl(210,20%,45%)", fontSize: "10px" }}>{c.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FraudSection() {
  return (
    <div className="space-y-4">
      {/* Fraud Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="admin-card p-4 border border-red-500/20">
          <p className="admin-text-muted text-xs mb-2">Flagged Accounts</p>
          <p className="text-2xl font-black text-red-400 tabular-nums">{adminKPIs.fraudFlaggedCount}</p>
          <p className="text-[10px] admin-text-muted mt-1">↑ 12 since last week</p>
        </div>
        <div className="admin-card p-4">
          <p className="admin-text-muted text-xs mb-2">Auto-Approval Rate</p>
          <p className="text-2xl font-black text-emerald-400 tabular-nums">{(adminKPIs.autoApprovalRate * 100).toFixed(1)}%</p>
          <p className="text-[10px] admin-text-muted mt-1">3,125 of 3,218 claims</p>
        </div>
        <div className="admin-card p-4">
          <p className="admin-text-muted text-xs mb-2">Fraud Prevented</p>
          <p className="text-2xl font-black text-amber-400 tabular-nums">₹1.2L</p>
          <p className="text-[10px] admin-text-muted mt-1">Estimated this month</p>
        </div>
      </div>

      {/* Fraud Alerts */}
      <div className="admin-card p-4">
        <h3 className="admin-text font-semibold text-sm mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" /> Anomaly Alerts
        </h3>
        <div className="space-y-3">
          {fraudAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${
                alert.severity === "critical" ? "border-red-500/30 bg-red-500/5" :
                alert.severity === "high" ? "border-amber-500/25 bg-amber-500/5" : "border-amber-400/20 bg-amber-400/5"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge level={alert.severity} />
                  <span className="text-xs font-bold admin-text">{alert.type}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 admin-text-muted hover:text-red-400 transition-colors">
                    Suspend
                  </button>
                  <button className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 admin-text-muted hover:admin-text transition-colors">
                    Review
                  </button>
                </div>
              </div>
              <p className="text-xs admin-text-muted mb-2 leading-relaxed">{alert.detail}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] admin-text-muted">
                  <span className="font-mono">{alert.riderId}</span>
                  <span>•</span>
                  <MapPin className="w-2.5 h-2.5 inline mr-0.5" />{alert.zone}
                  <span>•</span>
                  <Clock className="w-2.5 h-2.5 inline mr-0.5" />{alert.flaggedAt}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] admin-text-muted">Reliability:</span>
                  <span className={`text-xs font-bold tabular-nums ${alert.reliabilityScore < 40 ? "text-red-400" : "text-amber-400"}`}>
                    {alert.reliabilityScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reliability Distribution */}
      <div className="admin-card p-4">
        <h3 className="admin-text font-semibold text-sm mb-4">Rider Reliability Score Distribution</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reliabilityDistribution} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "hsl(210,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(210,20%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<AdminTooltip />} />
              <Bar dataKey="count" name="Riders" fill="#2CB67D" radius={[4, 4, 0, 0]}>
                {reliabilityDistribution.map((d, i) => (
                  <Cell key={i} fill={i < 2 ? "#ef4444" : i < 3 ? "#f59e0b" : "#2CB67D"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[10px] admin-text-muted mt-2">
          <span className="text-red-400">High risk (50 riders)</span>
          <span className="text-amber-400">Moderate (284)</span>
          <span className="text-emerald-400">Excellent (9,008)</span>
        </div>
      </div>
    </div>
  );
}

function PlatformSection() {
  const [simulated, setSimulated] = useState(false);

  return (
    <div className="space-y-4">
      {/* Activity Monitor */}
      <div className="admin-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="admin-text font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Andheri West — Activity Monitor
          </h3>
          <button
            onClick={() => setSimulated(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-colors"
          >
            Simulate Outage
          </button>
        </div>

        {simulated && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/5 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-400">Zone X: 72% drop in activity in last 10 minutes</p>
              <p className="text-[10px] admin-text-muted mt-0.5">Auto-claim triggers activated for 89 affected riders</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto admin-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(222,30%,18%)" }}>
                {["Time", "Active Riders", "Order Volume", "vs Normal", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-wide" style={{ color: "hsl(210,20%,45%)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platformActivityFeed.map((row, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "hsl(222,30%,13%)" }}>
                  <td className="px-3 py-2.5 font-mono" style={{ color: "hsl(210,20%,55%)" }}>{row.time}</td>
                  <td className="px-3 py-2.5 font-bold admin-text tabular-nums">{row.activeRiders}</td>
                  <td className="px-3 py-2.5 tabular-nums" style={{ color: "hsl(210,20%,70%)" }}>{row.orderVolume}%</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className={`h-full rounded-full transition-all ${
                            row.status === "normal" ? "bg-emerald-500" :
                            row.status === "warning" ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${row.orderVolume}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${
                        row.status === "normal" ? "text-emerald-400" :
                        row.status === "warning" ? "text-amber-400" : "text-red-400"
                      }`}>{row.orderVolume}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-semibold capitalize ${
                      row.status === "normal" ? "text-emerald-400" :
                      row.status === "warning" ? "text-amber-400" : "text-red-400"
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "API Latency", value: "142ms", ok: true },
          { label: "Claim Engine", value: "Operational", ok: true },
          { label: "Weather API", value: "Operational", ok: true },
          { label: "UPI Gateway", value: "Degraded", ok: false },
        ].map(item => (
          <div key={item.label} className={`admin-card p-3 border ${item.ok ? "border-emerald-500/15" : "border-amber-500/20"}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${item.ok ? "bg-emerald-400 animate-pulse-soft" : "bg-amber-400"}`} />
              <span className="text-[10px] admin-text-muted uppercase tracking-wide">{item.label}</span>
            </div>
            <p className={`text-sm font-bold ${item.ok ? "text-emerald-400" : "text-amber-400"}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIInsightsSection() {
  const priorityIcon = { high: "🔴", medium: "🟡", low: "🟢" };
  const typeIcon = {
    disruption_forecast: <CloudRain className="w-4 h-4 text-blue-400" />,
    premium_adjustment: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    fraud_risk: <Flag className="w-4 h-4 text-red-400" />,
    platform_health: <Activity className="w-4 h-4 text-violet-400" />,
  };

  return (
    <div className="space-y-4">
      <div className="admin-card p-4 border border-violet-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-violet-400" />
          <h3 className="admin-text font-bold text-sm">RakshAI Intelligence Engine</h3>
        </div>
        <p className="text-xs admin-text-muted">Predictive insights powered by 42M+ data points across weather, platform API, and historical disruption patterns.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {aiInsights.map((insight, i) => (
          <div
            key={i}
            className={`admin-card p-4 border ${
              insight.priority === "high" ? "border-red-500/20" :
              insight.priority === "medium" ? "border-amber-500/20" : "border-emerald-500/20"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                {typeIcon[insight.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <SeverityBadge level={insight.priority} />
                </div>
                <p className="text-sm font-bold admin-text mt-1 leading-tight">{insight.title}</p>
              </div>
            </div>
            <p className="text-xs admin-text-muted leading-relaxed mb-3">{insight.detail}</p>
            <div className="p-2.5 rounded-lg border" style={{ borderColor: "hsl(222,30%,20%)", background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] admin-text-muted mb-0.5">Suggested Action</p>
              <p className="text-xs font-semibold admin-text">{insight.suggestedAction}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[10px] text-emerald-400 font-semibold">{insight.impact}</p>
              <button className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 admin-text-muted hover:text-emerald-400 transition-colors">
                Apply →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingSection() {
  const [params, setParams] = useState(pricingParams);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<null | { avgPremium: number; estimatedRevenue: number }>(null);

  const simulateImpact = () => {
    setSimulating(true);
    setTimeout(() => {
      const base = params.basePremium;
      const gstMul = 1 + params.gstRate;
      const avgPremium = Math.round((base * 1.35 + params.platformFee) * gstMul);
      setSimResult({ avgPremium, estimatedRevenue: avgPremium * adminKPIs.activePoliciesThisWeek });
      setSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="admin-card p-5 space-y-4">
          <h3 className="admin-text font-bold text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" /> Pricing Parameters
          </h3>

          {[
            { key: "basePremium" as const, label: "Base Weekly Premium (₹)", min: 12, max: 35, step: 1 },
            { key: "rainRiskWeight" as const, label: "Rain Risk Weight", min: 1.0, max: 2.5, step: 0.1 },
            { key: "heatRiskWeight" as const, label: "Heat Risk Weight", min: 1.0, max: 2.0, step: 0.1 },
            { key: "outageRiskWeight" as const, label: "Outage Risk Weight", min: 1.0, max: 2.5, step: 0.1 },
            { key: "reliabilityDiscountRate" as const, label: "Reliability Discount Rate", min: 0.05, max: 0.25, step: 0.01 },
          ].map(field => (
            <div key={field.key}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="admin-text-muted">{field.label}</span>
                <span className="admin-text font-bold tabular-nums">
                  {field.key === "basePremium" ? "₹" : ""}{params[field.key]}
                  {["rainRiskWeight", "heatRiskWeight", "outageRiskWeight"].includes(field.key) ? "×" : ""}
                  {field.key === "reliabilityDiscountRate" ? " (" + Math.round(params[field.key] * 100) + "%)" : ""}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={params[field.key]}
                onChange={e => setParams(p => ({ ...p, [field.key]: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5"
              />
            </div>
          ))}

          <button
            onClick={simulateImpact}
            disabled={simulating}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-white"
            style={{ background: "linear-gradient(135deg, hsl(173,58%,40%), hsl(173,58%,32%))" }}
          >
            {simulating ? <><RefreshCw className="w-4 h-4 animate-spin" />Simulating…</> : <><Zap className="w-4 h-4" />Simulate Impact</>}
          </button>
        </div>

        {/* Impact Preview */}
        <div className="space-y-3">
          {simResult && (
            <div className="admin-card p-4 border border-emerald-500/20 animate-scale-in">
              <h3 className="admin-text font-bold text-sm mb-4">Simulation Result</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="admin-text-muted">New Avg Premium</span>
                  <span className="text-emerald-400 font-bold tabular-nums">₹{simResult.avgPremium}/wk</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="admin-text-muted">Est. Weekly Revenue</span>
                  <span className="admin-text font-bold tabular-nums">{fmt(simResult.estimatedRevenue, "₹")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="admin-text-muted">vs Current</span>
                  <span className="text-emerald-400 font-bold">
                    +{fmt(simResult.estimatedRevenue - adminKPIs.activePoliciesThisWeek * 29, "₹")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="admin-card p-4">
            <h3 className="admin-text font-semibold text-sm mb-3">Current Pricing Matrix</h3>
            <div className="space-y-2">
              {[
                { zone: "Low risk (score <60)", premium: "₹22–25" },
                { zone: "Medium risk (60–75)", premium: "₹26–32" },
                { zone: "High risk (>75)", premium: "₹33–41" },
              ].map(row => (
                <div key={row.zone} className="flex justify-between text-xs">
                  <span className="admin-text-muted">{row.zone}</span>
                  <span className="admin-text font-semibold tabular-nums">{row.premium}/wk</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-4">
            <h3 className="admin-text font-semibold text-sm mb-3">Coverage Limits</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="admin-text-muted">Max payout/week</span>
                <span className="admin-text font-semibold">₹{params.maxPayoutPerWeek.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="admin-text-muted">GST rate</span>
                <span className="admin-text font-semibold">{(params.gstRate * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="admin-text-muted">Platform fee</span>
                <span className="admin-text font-semibold">₹{params.platformFee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ADMIN PAGE
// ============================================================
const navItems: { id: AdminSection; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "zones", label: "Zone Risk", icon: MapPin },
  { id: "claims", label: "Claims", icon: CheckCircle2 },
  { id: "fraud", label: "Fraud Detection", icon: Flag, badge: "47" },
  { id: "platform", label: "Platform Health", icon: Activity },
  { id: "ai", label: "AI Insights", icon: Brain, badge: "4" },
  { id: "pricing", label: "Pricing Control", icon: Sliders },
];

export default function Admin() {
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>("overview");
  const [liveTime, setLiveTime] = useState(new Date());

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "rakshai_admin" && password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid name or password.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen admin-bg flex flex-col items-center justify-center p-4" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <div className="w-full max-w-sm border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl" style={{ background: "hsl(222,40%,10%)" }}>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, hsl(173,58%,40%), hsl(173,58%,32%))" }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black admin-text">Admin Sign In</h1>
            <p className="text-xs admin-text-muted">Enter admin credentials to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold admin-text-muted px-1">Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-sm admin-text border border-white/5 focus:outline-none focus:ring-2 ring-emerald-500/30 transition-all placeholder:text-slate-600"
                style={{ background: "hsl(222,35%,12%)" }}
                placeholder="Enter admin name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold admin-text-muted px-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm admin-text border border-white/5 focus:outline-none focus:ring-2 ring-emerald-500/30 transition-all placeholder:text-slate-600"
                style={{ background: "hsl(222,35%,12%)" }}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <p className="text-xs text-red-400 font-medium px-1">{error}</p>}
            
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] mt-2 flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, hsl(173,58%,40%), hsl(173,58%,32%))" }}
            >
              Sign In
            </button>
          </form>
          
          <div className="text-center pt-2">
            <button onClick={() => navigate("/")} className="text-xs font-medium admin-text-muted hover:admin-text transition-colors">
              ← Back to Rider App
            </button>
          </div>
        </div>
      </div>
    );
  }

  const titles: Record<AdminSection, string> = {
    overview: "Global Dashboard",
    zones: "Zone Risk Engine",
    claims: "Claim Monitor",
    fraud: "Fraud Detection",
    platform: "Platform Health",
    ai: "AI Insights",
    pricing: "Policy & Pricing Control",
  };

  return (
    <div className="min-h-screen admin-bg flex" style={{ fontFamily: '"DM Sans", sans-serif' }}>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r" style={{ background: "hsl(222,47%,7%)", borderColor: "hsl(222,30%,14%)" }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b" style={{ borderColor: "hsl(222,30%,14%)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(173,58%,40%), hsl(173,58%,32%))" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black admin-text">RakshAI</p>
              <p className="text-[9px] admin-text-muted uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                section === item.id
                  ? "text-emerald-400"
                  : "admin-text-muted hover:admin-text"
              }`}
              style={{
                background: section === item.id ? "rgba(44,182,125,0.1)" : "transparent",
                color: section === item.id ? "#34d399" : undefined,
              }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left text-xs">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: "hsl(222,30%,14%)" }}>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs admin-text-muted hover:admin-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Rider App
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "hsl(222,30%,14%)", background: "hsl(222,47%,7%)" }}>
          {/* Mobile nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="md:hidden p-2 rounded-xl admin-text-muted hover:admin-text transition-colors"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
            <div>
              <h1 className="text-sm font-bold admin-text">{titles[section]}</h1>
              <p className="text-[10px] admin-text-muted">RakshAI Intelligence Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live clock */}
            <div className="hidden md:flex items-center gap-1.5 text-xs admin-text-muted">
              <span className="live-dot scale-75" />
              {liveTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>

            {/* Alert bell */}
            <button className="relative p-2 rounded-xl admin-text-muted hover:admin-text transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>

            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "hsl(222,35%,12%)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(173,58%,40%), hsl(173,58%,32%))" }}>
                A
              </div>
              <span className="text-xs font-semibold admin-text hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b admin-scrollbar" style={{ borderColor: "hsl(222,30%,14%)", background: "hsl(222,47%,7%)" }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                section === item.id ? "bg-emerald-500/15 text-emerald-400" : "admin-text-muted"
              }`}
              style={{ color: section === item.id ? "#34d399" : undefined }}
            >
              <item.icon className="w-3 h-3" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto admin-scrollbar p-4 md:p-5">
          <div className="max-w-6xl mx-auto">
            {section === "overview" && <OverviewSection liveAlertCount={liveDisruptionAlerts.length} />}
            {section === "zones" && <ZonesSection />}
            {section === "claims" && <ClaimsSection />}
            {section === "fraud" && <FraudSection />}
            {section === "platform" && <PlatformSection />}
            {section === "ai" && <AIInsightsSection />}
            {section === "pricing" && <PricingSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
