import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ArrowRight, Share2, Download, Shield } from "lucide-react";
import { mockRider, transactionTimeline } from "@/lib/mockData";
import { AnimatedSection } from "@/components/AnimatedSection";

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ["#2CB67D", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <div
      className="absolute w-1.5 h-1.5 rounded-sm opacity-0"
      style={{
        left: `${x}%`,
        top: "-8px",
        backgroundColor: color,
        animation: `confetti-fall 1.2s ease-in ${delay}ms forwards`,
      }}
    />
  );
}

export default function Payout() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      delay: i * 40,
      x: Math.random() * 100,
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style>{`
            @keyframes confetti-fall {
              0% { opacity: 1; transform: translateY(0) rotate(0deg); }
              100% { opacity: 0; transform: translateY(${typeof window !== 'undefined' ? window.innerHeight : 700}px) rotate(720deg); }
            }
          `}</style>
          {confettiParticles.map(p => (
            <ConfettiParticle key={p.id} delay={p.delay} x={p.x} />
          ))}
        </div>
      )}

      <nav className="container flex items-center gap-3 py-5">
        <button onClick={() => navigate("/dashboard")} className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all border border-border/50">
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="font-bold text-base">Payout</h1>
          <p className="text-[10px] text-muted-foreground">Claim settled</p>
        </div>
      </nav>

      <div className="container max-w-md mx-auto space-y-4 pb-12">

        {/* Success Hero */}
        <AnimatedSection>
          <div className="glass-card p-8 text-center gradient-card">
            <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-success/30 animate-success-pop">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Payout credited instantly</p>
            <p className="text-5xl font-black text-success tabular-nums mb-1">₹{mockRider.payoutAmount}</p>
            <p className="text-sm text-muted-foreground">To: arjun@oksbi</p>

            <div className="mt-6 flex justify-center gap-3">
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-secondary px-4 py-2 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-secondary px-4 py-2 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all">
                <Download className="w-4 h-4" /> Receipt
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Claim Summary */}
        <AnimatedSection delay={100}>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-4">Claim Summary</h3>
            <div className="space-y-2.5">
              {[
                { label: "Claim ID", value: "CLM-2026-03847", mono: true },
                { label: "Reason", value: "Rain disruption" },
                { label: "Expected earnings", value: `₹${mockRider.expectedEarnings.toLocaleString()}` },
                { label: "Actual earnings", value: `₹${mockRider.actualEarnings.toLocaleString()}` },
                { label: "Gap covered", value: `₹${mockRider.expectedEarnings - mockRider.actualEarnings}`, color: "text-destructive" },
                { label: "Payout (85%)", value: `₹${mockRider.payoutAmount}`, color: "text-success font-bold" },
                { label: "Processing time", value: "2 min 48 sec" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`tabular-nums ${item.mono ? "font-mono text-xs" : "font-medium"} ${item.color ?? ""}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Transaction Timeline */}
        <AnimatedSection delay={200}>
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-4">Transaction Timeline</h3>
            <div className="space-y-0">
              {transactionTimeline.map((t, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full shrink-0 ring-2 ring-background ${
                      t.type === "success" ? "bg-success" :
                      t.type === "alert" ? "bg-destructive" : "bg-primary"
                    }`} />
                    {i < transactionTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1 min-h-4" />
                    )}
                  </div>
                  <div className="pb-2 min-w-0">
                    <p className="text-sm font-medium leading-none text-foreground">{t.event}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Coverage Renewal */}
        <AnimatedSection delay={280}>
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Stay protected</p>
                <p className="text-xs text-muted-foreground">Coverage renews Sunday</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/coverage")}
              className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/15 transition-colors"
            >
              Manage
            </button>
          </div>
        </AnimatedSection>

        {/* Back to Dashboard */}
        <AnimatedSection delay={360}>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full gradient-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          >
            Back to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </AnimatedSection>
      </div>
    </div>
  );
}
