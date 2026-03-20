import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Check, Zap, Clock, Star, ChevronRight, Loader2 } from "lucide-react";
import { mockRider } from "@/lib/mockData";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useCoverageApi } from "@/hooks/useApiSimulator";

const coverageItems = [
  "Heavy rain disruptions (>60% probability)",
  "Extreme heat (temperature >42°C)",
  "Platform outages lasting >30 minutes",
  "Earnings gap up to ₹1,500/week",
  "Unlimited auto-claim triggers",
  "UPI instant payout within 3 minutes",
];

const breakdown = [
  { label: "Base coverage", value: "₹18", color: "text-foreground" },
  { label: "Zone risk adjustment (+72 score)", value: "+₹7", color: "text-accent" },
  { label: "Reliability discount (88 score)", value: "-₹3", color: "text-success" },
  { label: "Platform fee", value: "₹2", color: "text-foreground" },
  { label: "GST (18%)", value: "₹5", color: "text-muted-foreground" },
];

export default function Coverage() {
  const navigate = useNavigate();
  const { status, activate } = useCoverageApi();
  const [activated, setActivated] = useState(false);

  const handleActivate = async () => {
    await activate(mockRider.weeklyPremium);
    setActivated(true);
  };

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen gradient-hero">
      <nav className="container flex items-center gap-3 py-5">
        <button onClick={() => navigate("/dashboard")} className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all border border-border/50">
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="font-bold text-base">Coverage Plan</h1>
          <p className="text-[10px] text-muted-foreground">Weekly Income Shield</p>
        </div>
      </nav>

      <div className="container max-w-md mx-auto space-y-4 pb-12">

        {/* Hero Card */}
        <AnimatedSection>
          <div className="glass-card p-6 text-center gradient-card">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-1">Weekly Income Shield</h2>
            <p className="text-muted-foreground text-sm mb-5">Covers earnings loss from rain, heat & platform outages</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black text-gradient tabular-nums">₹{mockRider.weeklyPremium}</span>
              <span className="text-base font-medium text-muted-foreground">/week</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">≈ ₹4.14/day • Less than a chai</p>

            {/* Star rating */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-accent fill-accent" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">4.9 (2,841 reviews)</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Premium Breakdown */}
        <AnimatedSection delay={80}>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Premium Breakdown
            </h3>
            <div className="space-y-3">
              {breakdown.map(item => (
                <div key={item.label} className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`tabular-nums font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-sm font-bold">Total Weekly Premium</span>
                <span className="text-lg font-black tabular-nums text-gradient">₹{mockRider.weeklyPremium}</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* What's Covered */}
        <AnimatedSection delay={160}>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-3">What's covered this week</h3>
            <div className="grid gap-2">
              {coverageItems.map(item => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Policy Timeline */}
        <AnimatedSection delay={240}>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">Coverage Period</span>
              </div>
              <span className="text-muted-foreground tabular-nums">Mar 20 – Mar 27</span>
            </div>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/3 gradient-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">2 of 7 days elapsed</p>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={320}>
          {activated ? (
            <div className="glass-card p-6 text-center border-2 border-success/30 bg-success/5">
              <div className="w-14 h-14 rounded-full gradient-success flex items-center justify-center mx-auto mb-3 shadow-lg shadow-success/25 animate-success-pop">
                <Check className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-success text-lg mb-1">Coverage Activated!</p>
              <p className="text-xs text-muted-foreground mb-4">Valid until Sunday, March 27 • Policy ID: POL-2026-8841</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full gradient-success text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              >
                Go to Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleActivate}
                disabled={isLoading}
                className="w-full gradient-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl active:scale-[0.97] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing payment…
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Activate for ₹{mockRider.weeklyPremium}/week
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Charged to your UPI • Auto-renews every Sunday
              </p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
