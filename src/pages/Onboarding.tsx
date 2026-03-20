import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, ArrowRight, Check, MapPin, Navigation, Phone, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cities, zones, zoneRiskMap } from "@/lib/mockData";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useGeolocation } from "@/hooks/useGeolocation";

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < step ? "gradient-primary" : i === step ? "bg-primary/40 flex-[2]" : "bg-muted"
          } ${i === step ? "w-6" : "w-4"}`}
        />
      ))}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { status: gpsStatus, city: gpsCity, zone: gpsZone, error: gpsError, requestLocation } = useGeolocation();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [zone, setZone] = useState("");
  const [platform, setPlatform] = useState<"Blinkit" | "Zepto" | "">("");

  const totalSteps = 5;

  // Auto-fill city/zone if GPS granted
  const handleGpsDetect = async () => {
    requestLocation();
  };

  // When GPS returns a city, set it
  const handleGpsCityAccept = () => {
    if (gpsCity) {
      setCity(gpsCity);
      if (gpsZone) setZone(gpsZone);
    }
  };

  const zoneRisk = zone ? (zoneRiskMap[zone] ?? 72) : 72;
  const reliability = name.length > 3 ? Math.min(95, 75 + Math.floor(name.length * 1.5)) : 88;
  const premium = Math.max(
    22,
    Math.round(18 + (zoneRisk - 50) * 0.22 - (reliability - 70) * 0.08 + 2 + (18 + 2 + (zoneRisk - 50) * 0.22) * 0.18)
  );

  const canProceed =
    step === 0 ? name.trim().length > 1 && phone.length >= 10 :
    step === 1 ? !!platform :
    step === 2 ? !!city :
    step === 3 ? !!zone :
    true;

  const handleNext = () => {
    if (canProceed && step < totalSteps - 1) setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Nav */}
      <nav className="container flex items-center gap-3 py-5">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
          className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all border border-border/50"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div className="flex-1">
          <ProgressDots step={step} total={totalSteps} />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {step + 1} / {totalSteps}
        </span>
      </nav>

      <div className="flex-1 container flex flex-col justify-center max-w-md mx-auto pb-12 px-4">

        {/* Step 0: Name & Phone */}
        {step === 0 && (
          <AnimatedSection key="step0">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Let's get you protected</h2>
              <p className="text-muted-foreground text-sm">We'll personalize your coverage in under 30 seconds.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Arjun Kumar"
                  className="w-full px-4 py-3.5 rounded-xl border bg-card text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-muted-foreground/50"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Mobile Number</label>
                <div className="flex">
                  <div className="px-3.5 py-3.5 bg-muted border border-r-0 border-border rounded-l-xl text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-3.5 rounded-r-xl border bg-card text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Step 1: Platform */}
        {step === 1 && (
          <AnimatedSection key="step1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Which platform do you work on?</h2>
              <p className="text-muted-foreground text-sm">This helps us fetch your order volume and earnings data.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["Blinkit", "Zepto"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`p-5 rounded-2xl border-2 text-center font-bold text-lg transition-all active:scale-[0.97] ${
                    platform === p
                      ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/15"
                      : "border-border bg-card hover:border-primary/30 text-foreground"
                  }`}
                >
                  {p === "Blinkit" ? "🟡" : "🟣"}
                  <br />
                  <span className="text-base font-semibold mt-1 block">{p}</span>
                  {platform === p && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Step 2: City + GPS */}
        {step === 2 && (
          <AnimatedSection key="step2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Which city do you deliver in?</h2>
              <p className="text-muted-foreground text-sm">Used to assess regional weather and platform risk factors.</p>
            </div>

            {/* GPS Detection */}
            <div className="mb-4">
              {gpsStatus === "idle" && (
                <button
                  onClick={handleGpsDetect}
                  className="w-full p-3.5 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/8 active:scale-[0.98] transition-all"
                >
                  <Navigation className="w-4 h-4" /> Detect my location automatically
                </button>
              )}
              {gpsStatus === "loading" && (
                <div className="w-full p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm font-medium flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Detecting your location…
                </div>
              )}
              {gpsStatus === "granted" && gpsCity && (
                <div className="p-3.5 rounded-xl border border-success/30 bg-success/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-success text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Detected: <strong>{gpsCity}</strong>
                    </div>
                    <button
                      onClick={handleGpsCityAccept}
                      className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/15 transition-colors"
                    >
                      Use this
                    </button>
                  </div>
                </div>
              )}
              {gpsStatus === "denied" && (
                <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  {gpsError ?? "Location access denied — select manually below."}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {cities.map(c => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setZone(""); }}
                  className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all active:scale-[0.97] ${
                    city === c
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "bg-card hover:border-primary/30 text-foreground border-border"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 mb-1 opacity-50" />
                  {c}
                </button>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Step 3: Zone */}
        {step === 3 && (
          <AnimatedSection key="step3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Select your delivery zone</h2>
              <p className="text-muted-foreground text-sm">Your premium is priced by zone-level risk data.</p>
            </div>
            <div className="grid gap-2.5">
              {(zones[city] || []).map(z => {
                const risk = zoneRiskMap[z] ?? 65;
                const riskLabel = risk > 70 ? "High risk" : risk > 55 ? "Medium risk" : "Low risk";
                const riskColor = risk > 70 ? "text-destructive" : risk > 55 ? "text-accent" : "text-success";
                return (
                  <button
                    key={z}
                    onClick={() => setZone(z)}
                    className={`p-4 rounded-xl border text-left transition-all active:scale-[0.97] flex items-center justify-between ${
                      zone === z
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:border-primary/30 border-border"
                    }`}
                  >
                    <span className={`text-sm font-medium ${zone === z ? "text-primary" : "text-foreground"}`}>{z}</span>
                    <span className={`text-xs font-semibold ${riskColor}`}>{riskLabel}</span>
                  </button>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        {/* Step 4: Profile Summary */}
        {step === 4 && (
          <AnimatedSection key="step4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30 animate-success-pop">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Your profile is ready, {name.split(" ")[0]}!</h2>
              <p className="text-muted-foreground text-sm">Here's your personalized risk assessment & coverage plan.</p>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Platform", value: platform },
                { label: "Zone", value: `${zone}, ${city}` },
                { label: "Zone Risk Score", value: `${zoneRisk}/100`, highlight: "accent" as const },
                { label: "Reliability Score", value: `${reliability}/100`, highlight: "success" as const },
              ].map(item => (
                <div key={item.label} className="glass-card px-4 py-3.5 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${
                    item.highlight === "accent" ? "text-accent" :
                    item.highlight === "success" ? "text-success" : "text-foreground"
                  }`}>{item.value}</span>
                </div>
              ))}

              {/* Premium highlight */}
              <div className="glass-card px-4 py-4 flex justify-between items-center border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Premium</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Rain + Heat + Outage coverage</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gradient tabular-nums">₹{premium}</p>
                  <p className="text-[10px] text-muted-foreground">per week</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-success/5 border border-success/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your <strong className="text-foreground">reliability discount</strong> of ₹{Math.round((reliability - 70) * 0.08)} applied based on your history.
                </p>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* CTA */}
        <div className="mt-8">
          {step < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full gradient-primary text-white py-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.97] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full gradient-primary text-white py-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              Go to Dashboard <Check className="w-4 h-4" />
            </button>
          )}
          {step === 0 && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              By continuing, you agree to our{" "}
              <span className="text-primary underline underline-offset-2 cursor-pointer">Terms of Service</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
