import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield, CloudRain, TrendingDown, Zap, AlertTriangle, ChevronRight,
  Activity, Bell, BarChart3, Home, User, Clock, Wifi, Thermometer,
  MapPin, TrendingUp, RefreshCw, Eye
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { mockRider, earningsHistory, weatherAlerts, hourlyActivity } from "@/lib/mockData";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useRealtime } from "@/hooks/useRealtime";

function GaugeRing({ value, max = 100, size = 96, color, label }: { value: number; max?: number; size?: number; color: string; label?: string }) {
  const sw = 9;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / max);
  const pct = Math.round((value / max) * 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={sw} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold tabular-nums">{value}</span>
        {label && <span className="text-[9px] text-muted-foreground leading-none">{label}</span>}
      </div>
    </div>
  );
}

function AlertLevelBar({ level }: { level: "low" | "medium" | "high" | "critical" }) {
  const cfg = {
    low: { label: "Low Risk", color: "bg-success", w: "25%", text: "text-success" },
    medium: { label: "Moderate", color: "bg-accent", w: "55%", text: "text-accent" },
    high: { label: "High Risk", color: "bg-orange-500", w: "75%", text: "text-orange-500" },
    critical: { label: "Critical", color: "bg-destructive", w: "100%", text: "text-destructive" },
  }[level];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${cfg.color}`} style={{ width: cfg.w }} />
      </div>
      <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ₹{p.value}
        </p>
      ))}
    </div>
  );
}

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Shield, label: "Coverage", path: "/coverage" },
  { icon: BarChart3, label: "Claims", path: "/claim" },
  { icon: User, label: "Profile", path: "/" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [coverageActive, setCoverageActive] = useState(mockRider.coverageActive);
  const [showHourly, setShowHourly] = useState(false);
  const { metrics, triggerDisruption, resetDisruption } = useRealtime(mockRider.actualEarnings);

  const earningsGap = mockRider.expectedEarnings - metrics.actualEarnings;
  const earningsPercent = Math.round((metrics.actualEarnings / mockRider.expectedEarnings) * 100);

  const chartData = showHourly ? hourlyActivity.map(h => ({ day: h.hour, expected: h.orders * 4, actual: h.earnings })) : earningsHistory;

  const platformStatusConfig = {
    operational: { label: "Operational", color: "text-success", dot: "bg-success" },
    degraded: { label: "Degraded", color: "text-accent", dot: "bg-accent" },
    outage: { label: "Outage", color: "text-destructive", dot: "bg-destructive" },
  };
  const ps = platformStatusConfig[metrics.platformStatus];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-4 pt-5 pb-20 rounded-b-[2rem] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30" />
          <div className="absolute top-8 right-8 w-20 h-20 rounded-full border border-white/20" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/10" />
        </div>

        <div className="container relative flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Good morning,</p>
            <h1 className="text-xl font-bold text-white">{mockRider.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-white/50" />
              <span className="text-xs text-white/60">{mockRider.zone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/surge")}
              className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition-transform relative"
            >
              <Bell className="w-4.5 h-4.5 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-primary" />
            </button>
          </div>
        </div>

        {/* Coverage Card */}
        <div className="container relative">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${coverageActive ? "bg-white/25" : "bg-white/10"}`}>
                  <Shield className={`w-5 h-5 ${coverageActive ? "text-white" : "text-white/50"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{coverageActive ? "Coverage Active" : "Coverage Inactive"}</p>
                  <p className="text-xs text-white/60">Weekly plan • ₹{mockRider.weeklyPremium}/wk</p>
                </div>
              </div>
              <button
                onClick={() => coverageActive ? setCoverageActive(false) : navigate("/coverage")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  coverageActive
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white text-primary"
                }`}
              >
                {coverageActive ? "Active ✓" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-8 space-y-4">

        {/* Alert Level */}
        {metrics.disruptionActive && (
          <AnimatedSection>
            <div className="glass-card p-4 border-2 border-destructive/30 bg-destructive/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-destructive">Disruption Active</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{metrics.disruptionReason} • Earnings protection triggered</p>
                </div>
                <button onClick={() => navigate("/claim")} className="text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-lg">
                  View Claim
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Earnings Card */}
        <AnimatedSection>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                {showHourly ? "Today's Activity" : "Weekly Earnings"}
              </h3>
              <button
                onClick={() => setShowHourly(!showHourly)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-secondary px-2.5 py-1 rounded-lg"
              >
                <Eye className="w-3 h-3" />
                {showHourly ? "Weekly" : "Hourly"}
              </button>
            </div>

            {/* Earnings Numbers */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Expected</p>
                <p className="text-xl font-bold tabular-nums">₹{mockRider.expectedEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">Actual</p>
                <p className="text-xl font-bold tabular-nums text-destructive">₹{metrics.actualEarnings.toLocaleString()}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(173,58%,39%)" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(173,58%,39%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0,72%,51%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(0,72%,51%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(210,10%,50%)" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="expected" stroke="hsl(173,58%,39%)" fill="url(#gradExpected)" strokeWidth={2} name="Expected" dot={false} />
                  <Area type="monotone" dataKey="actual" stroke="hsl(0,72%,51%)" fill="url(#gradActual)" strokeWidth={2} name="Actual" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gap Alert */}
            {earningsGap > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">₹{earningsGap.toLocaleString()} income gap</p>
                    <p className="text-[10px] text-muted-foreground">Coverage: {earningsPercent}% of expected</p>
                  </div>
                </div>
                <button onClick={() => navigate("/claim")} className="text-xs font-semibold text-destructive flex items-center gap-0.5">
                  Claim <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Risk & Reliability */}
        <AnimatedSection delay={80}>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 flex flex-col items-center">
              <GaugeRing value={mockRider.zoneRiskScore} color="hsl(38,92%,50%)" size={88} label="/ 100" />
              <p className="text-xs font-semibold mt-2.5">Zone Risk</p>
              <AlertLevelBar level={mockRider.zoneRiskScore > 70 ? "high" : mockRider.zoneRiskScore > 55 ? "medium" : "low"} />
            </div>
            <div className="glass-card p-4 flex flex-col items-center">
              <GaugeRing value={mockRider.reliabilityScore} color="hsl(152,60%,42%)" size={88} label="/ 100" />
              <p className="text-xs font-semibold mt-2.5">Reliability</p>
              <p className="text-[10px] text-muted-foreground">90-day avg</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Live Monitoring */}
        <AnimatedSection delay={160}>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Live Monitoring
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={triggerDisruption} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                  Simulate
                </button>
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <span className="live-dot scale-75" /> Live
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Weather */}
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    metrics.weatherSeverity > 60 ? "bg-blue-50" : "bg-secondary"
                  }`}>
                    <CloudRain className={`w-3.5 h-3.5 ${metrics.weatherSeverity > 60 ? "text-blue-500" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">Weather</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full transition-all duration-700" style={{ width: `${metrics.weatherSeverity}%` }} />
                  </div>
                  <span className={`text-xs font-medium ${metrics.weatherSeverity > 60 ? "text-accent" : "text-success"}`}>
                    {metrics.weatherLabel}
                  </span>
                </div>
              </div>

              {/* Order Volume */}
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    metrics.orderVolume < 50 ? "bg-orange-50" : "bg-secondary"
                  }`}>
                    <TrendingUp className={`w-3.5 h-3.5 ${metrics.orderVolume < 50 ? "text-orange-500" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">Order Volume</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${
                      metrics.orderVolume < 40 ? "bg-destructive" : metrics.orderVolume < 65 ? "bg-accent" : "bg-success"
                    }`} style={{ width: `${metrics.orderVolume}%` }} />
                  </div>
                  <span className={`text-xs font-medium ${
                    metrics.orderVolume < 40 ? "text-destructive" : metrics.orderVolume < 65 ? "text-accent" : "text-success"
                  }`}>
                    {metrics.orderVolume}%
                  </span>
                </div>
              </div>

              {/* Platform */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center">
                    <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">Platform Status</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${ps.dot} ${metrics.platformStatus === 'operational' ? 'animate-pulse-soft' : ''}`} />
                  <span className={`text-xs font-medium ${ps.color}`}>{ps.label}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Weather Alert */}
        <AnimatedSection delay={240}>
          <div className="glass-card p-4 border-l-4 border-accent">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-warning flex items-center justify-center shrink-0">
                <CloudRain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{weatherAlerts[0].message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {weatherAlerts[0].probability}% probability • {weatherAlerts[0].time}
                </p>
                <button
                  onClick={() => navigate("/surge")}
                  className="mt-2.5 text-xs font-bold text-primary flex items-center gap-1 hover:underline underline-offset-2"
                >
                  Add surge protection for ₹5 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection delay={320}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/claim")}
              className="glass-card-hover p-4 text-left active:scale-[0.97] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center mb-3">
                <AlertTriangle className="w-4.5 h-4.5 text-destructive" />
              </div>
              <p className="text-sm font-bold">File Claim</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Report income loss</p>
            </button>
            <button
              onClick={() => navigate("/coverage")}
              className="glass-card-hover p-4 text-left active:scale-[0.97] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Zap className="w-4.5 h-4.5 text-primary" />
              </div>
              <p className="text-sm font-bold">Manage Plan</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Coverage details</p>
            </button>
            <button
              onClick={resetDisruption}
              className="glass-card-hover p-4 text-left active:scale-[0.97] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center mb-3">
                <RefreshCw className="w-4.5 h-4.5 text-success" />
              </div>
              <p className="text-sm font-bold">Reset Alert</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Clear disruption</p>
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="glass-card-hover p-4 text-left active:scale-[0.97] transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
                <BarChart3 className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <p className="text-sm font-bold">Admin View</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Analytics dashboard</p>
            </button>
          </div>
        </AnimatedSection>

        {/* Claim History */}
        <AnimatedSection delay={400}>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Claims
              </h3>
              <span className="text-xs text-muted-foreground">3 claims paid</span>
            </div>
            {[
              { date: "Mar 15", amount: "₹450", reason: "Rain disruption", color: "text-blue-500" },
              { date: "Feb 28", amount: "₹380", reason: "Platform outage", color: "text-red-500" },
              { date: "Jan 19", amount: "₹520", reason: "Extreme heat", color: "text-orange-500" },
            ].map(c => (
              <div key={c.date} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{c.reason}</p>
                    <p className="text-[10px] text-muted-foreground">{c.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-success tabular-nums">{c.amount}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 safe-area-bottom">
        <div className="container flex justify-around py-2.5">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl active:scale-95 transition-all ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
