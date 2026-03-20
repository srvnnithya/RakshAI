import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, TrendingDown, ChevronRight, Loader2, CheckCircle2, CloudRain, Wifi, Thermometer } from "lucide-react";
import { mockRider } from "@/lib/mockData";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useClaimApi } from "@/hooks/useApiSimulator";

type DisruptionType = "rain" | "outage" | "heat";

const disruptionOptions: { type: DisruptionType; icon: typeof CloudRain; label: string; desc: string }[] = [
  { type: "rain", icon: CloudRain, label: "Heavy Rain", desc: "Order drop due to rainfall" },
  { type: "outage", icon: Wifi, label: "Platform Outage", desc: "App downtime / server failure" },
  { type: "heat", icon: Thermometer, label: "Extreme Heat", desc: "40°C+ temperature alert" },
];

const claimSteps = [
  { label: "Disruption detected", detail: "AI analyzed your zone data" },
  { label: "Earnings gap verified", detail: "Platform API cross-checked" },
  { label: "Claim auto-triggered", detail: "No manual action required" },
  { label: "Payout processing", detail: "UPI transfer initiated" },
];

export default function Claim() {
  const navigate = useNavigate();
  const { status, data, submitClaim } = useClaimApi();
  const [selectedType, setSelectedType] = useState<DisruptionType>("rain");
  const [step, setStep] = useState(0);
  const gap = mockRider.expectedEarnings - mockRider.actualEarnings;
  const pct = Math.round((mockRider.actualEarnings / mockRider.expectedEarnings) * 100);

  // Auto-progress steps with delays
  useEffect(() => {
    if (status === "loading") {
      setStep(0);
      const t1 = setTimeout(() => setStep(1), 600);
      const t2 = setTimeout(() => setStep(2), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    if (status === "success") setStep(3);
  }, [status]);

  const handleSubmit = () => {
    submitClaim(mockRider.expectedEarnings, mockRider.actualEarnings, selectedType);
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen gradient-hero">
      <nav className="container flex items-center gap-3 py-5">
        <button onClick={() => navigate("/dashboard")} className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all border border-border/50">
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="font-bold text-base">File a Claim</h1>
          <p className="text-[10px] text-muted-foreground">Income protection claim</p>
        </div>
      </nav>

      <div className="container max-w-md mx-auto space-y-4 pb-12">

        {/* Alert Banner */}
        <AnimatedSection>
          <div className="glass-card p-4 border-l-4 border-destructive bg-destructive/5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4.5 h-4.5 text-destructive" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-destructive">Income drop detected</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your earnings are {100 - pct}% below expected today. Auto-claim is available.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Disruption Selector */}
        <AnimatedSection delay={60}>
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Select disruption reason</h3>
            <div className="grid grid-cols-3 gap-2">
              {disruptionOptions.map(opt => (
                <button
                  key={opt.type}
                  onClick={() => setSelectedType(opt.type)}
                  disabled={isLoading || isSuccess}
                  className={`p-3 rounded-xl border text-center transition-all active:scale-[0.97] ${
                    selectedType === opt.type
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <opt.icon className={`w-5 h-5 mx-auto mb-1.5 ${selectedType === opt.type ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`text-[10px] font-semibold leading-tight ${selectedType === opt.type ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Earnings Comparison */}
        <AnimatedSection delay={120}>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-4">Earnings Comparison</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Expected</span>
                  <span className="font-bold tabular-nums">₹{mockRider.expectedEarnings.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary/30 w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Actual</span>
                  <span className="font-bold tabular-nums text-destructive">₹{mockRider.actualEarnings.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-destructive transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-bold">Earnings Gap</span>
                </div>
                <span className="text-base font-black tabular-nums text-destructive">₹{gap}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Estimated payout:</strong> ₹{Math.round(gap * 0.85)} (85% of gap, up to ₹1,500 max)
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Claim Status */}
        <AnimatedSection delay={200}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Claim Status</h3>
              {isSuccess && (
                <span className="text-xs font-semibold text-success bg-success/10 border border-success/20 px-2.5 py-0.5 rounded-full">
                  Auto-approved
                </span>
              )}
            </div>
            <div className="space-y-4">
              {claimSteps.map((s, i) => {
                const done = i < step || (i === step && isSuccess);
                const active = i === step && isLoading;
                return (
                  <div key={s.label} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500 ${
                      done ? "gradient-success text-white shadow-md shadow-success/25" :
                      active ? "border-2 border-primary text-primary" :
                      "bg-muted text-muted-foreground"
                    }`} style={{ transitionDelay: `${i * 200}ms` }}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${done || active ? "text-foreground" : "text-muted-foreground"}`}>
                        {s.label}
                      </p>
                      {(done || active) && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.detail}</p>
                      )}
                    </div>
                    {done && i === 2 && (
                      <span className="text-xs text-success font-semibold">✓ Done</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={280}>
          {!isLoading && !isSuccess && (
            <button
              onClick={handleSubmit}
              className="w-full gradient-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4.5 h-4.5" />
              Submit Claim — ₹{Math.round(gap * 0.85)} payout
            </button>
          )}

          {isLoading && (
            <div className="glass-card p-4 flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm font-medium">Verifying your claim with AI…</span>
            </div>
          )}

          {isSuccess && (
            <button
              onClick={() => navigate("/payout")}
              className="w-full gradient-success text-white py-4 rounded-xl font-bold shadow-xl shadow-success/25 hover:shadow-2xl active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              View Payout — ₹{data?.payoutAmount ?? Math.round(gap * 0.85)} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
