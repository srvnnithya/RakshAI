import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CloudRain, Check, ShieldPlus, Thermometer, TrendingDown, Zap, Loader2, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useSurgeApi } from "@/hooks/useApiSimulator";

const forecastItems = [
  { label: "Expected order drop", value: "60–70%", severity: "high", icon: TrendingDown },
  { label: "Estimated earnings loss", value: "₹400–600", severity: "high", icon: Zap },
  { label: "Affected delivery hours", value: "6 hours", severity: "medium", icon: Thermometer },
  { label: "Disruption probability", value: "85%", severity: "high", icon: CloudRain },
];

export default function Surge() {
  const navigate = useNavigate();
  const { status, upgradeSurge } = useSurgeApi();
  const [upgraded, setUpgraded] = useState(false);

  const handleUpgrade = async () => {
    await upgradeSurge(5);
    setUpgraded(true);
  };

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen gradient-hero">
      <nav className="container flex items-center gap-3 py-5">
        <button onClick={() => navigate("/dashboard")} className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all border border-border/50">
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="font-bold text-base">Surge Protection</h1>
          <p className="text-[10px] text-muted-foreground">AI-predicted risk alert</p>
        </div>
      </nav>

      <div className="container max-w-md mx-auto space-y-4 pb-12">

        {/* Alert Header */}
        <AnimatedSection>
          <div className="glass-card p-5 border-l-4 border-accent overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <CloudRain className="w-full h-full" />
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-warning flex items-center justify-center shrink-0 shadow-lg shadow-accent/25">
                <CloudRain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg">Heavy rainfall expected</h2>
                  <span className="badge-high">85%</span>
                </div>
                <p className="text-sm text-muted-foreground">Tomorrow, 2 PM – 8 PM in your delivery zone.</p>
                <p className="text-xs text-muted-foreground mt-1">Source: IMD weather forecast + historical order data</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Impact Forecast */}
        <AnimatedSection delay={80}>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" /> Impact Forecast
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {forecastItems.map(item => (
                <div key={item.label} className={`p-3 rounded-xl flex flex-col gap-1 ${
                  item.severity === "high" ? "bg-destructive/5 border border-destructive/10" : "bg-accent/5 border border-accent/10"
                }`}>
                  <item.icon className={`w-4 h-4 ${item.severity === "high" ? "text-destructive" : "text-accent"}`} />
                  <p className={`text-base font-bold tabular-nums ${item.severity === "high" ? "text-destructive" : "text-accent"}`}>
                    {item.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Upgrade Card */}
        <AnimatedSection delay={160}>
          {upgraded ? (
            <div className="glass-card p-6 text-center border-2 border-success/30 bg-success/5">
              <div className="w-14 h-14 rounded-full gradient-success flex items-center justify-center mx-auto mb-3 shadow-lg shadow-success/25 animate-success-pop">
                <Check className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-success text-lg mb-1">Surge Protection Active!</p>
              <p className="text-xs text-muted-foreground mb-2">Extra ₹1,000 coverage for tomorrow's disruption window.</p>
              <p className="text-xs text-muted-foreground mb-4">2 PM – 8 PM • Auto-claim enabled</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 gradient-success text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                >
                  Dashboard <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base">Add Surge Protection</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">One-time add-on for tomorrow</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gradient">₹5</p>
                  <p className="text-[10px] text-muted-foreground">one-time</p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {["Extra ₹1,000 income protection", "Auto-claim if earnings drop >40%", "Covers 2 PM – 8 PM window tomorrow", "Instant UPI credit"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-success" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full gradient-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl active:scale-[0.97] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Activating surge protection…
                  </>
                ) : (
                  <>
                    <ShieldPlus className="w-5 h-5" />
                    Upgrade Coverage for ₹5
                  </>
                )}
              </button>
            </div>
          )}
        </AnimatedSection>

        {/* Info Note */}
        <AnimatedSection delay={240}>
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">RakshAI AI model</strong> analyzes 12 real-time signals — IMD weather data, historical order patterns, platform health — to predict disruption risk 18–24 hours in advance.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
