import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, MapPin, ChevronRight, CloudRain, Thermometer, Wifi, Star, ArrowRight, TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react";
import heroRider from "@/assets/hero-rider.jpg";
import { AnimatedSection } from "@/components/AnimatedSection";

const features = [
  {
    icon: Shield,
    title: "Income Gap Protection",
    desc: "Get compensated when disruptions cut into your daily earnings. Rain, heat, outages — we've got you covered automatically.",
    color: "gradient-primary",
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    desc: "Claims auto-triggered and settled within minutes directly to your UPI. No paperwork, no waiting, no calls.",
    color: "gradient-success",
  },
  {
    icon: MapPin,
    title: "Hyperlocal Risk Pricing",
    desc: "Premiums calculated by your exact zone, real-time weather, and platform data. Pay only for your actual risk.",
    color: "gradient-warning",
  },
];

const disruptions = [
  { icon: CloudRain, label: "Heavy Rain", stat: "3.2× more cancellations", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Thermometer, label: "Extreme Heat", stat: "40% fewer delivery slots", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Wifi, label: "Platform Outage", stat: "Complete earnings loss", color: "text-red-500", bg: "bg-red-50" },
];

const steps = [
  { num: "01", title: "Sign up in 30 seconds", desc: "Share your name, city, and delivery zone. We build your risk profile instantly." },
  { num: "02", title: "Activate weekly coverage", desc: "Choose your plan. Premium starts at ₹29/week — less than a cup of tea daily." },
  { num: "03", title: "We monitor & auto-pay", desc: "When income drops below your threshold, RakshAI detects it and pays you instantly." },
];

const testimonials = [
  { name: "Ravi Kumar", zone: "Andheri West, Mumbai", text: "Got ₹680 credited when heavy rain hit last month. Didn't even have to call anyone.", platform: "Blinkit" },
  { name: "Suresh Naidu", zone: "Koramangala, Bangalore", text: "The surge protection alert saved me during that Zepto outage. Best ₹5 I ever spent.", platform: "Zepto" },
  { name: "Priya Sharma", zone: "Sector 18, Noida", text: "Weekly ₹29 is nothing. The peace of mind during rainy season is priceless.", platform: "Blinkit" },
];

function StatCounter({ value, suffix, label }: { value: string; suffix?: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold tabular-nums text-foreground">
        {value}<span className="text-primary">{suffix}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen gradient-hero">
      {/* Sticky Nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-sm" : "bg-transparent"}`}>
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">RakshAI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => navigate("/onboarding")}
              className="gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.97] transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container pt-10 pb-16 md:pt-16 md:pb-24">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <span className="live-dot scale-75" />
            AI-Powered Income Protection • Live in 6 cities
          </div>
          <h1 className="text-4xl md:text-[56px] font-bold leading-[1.08] mb-5">
            Protect your daily{" "}
            <span className="text-gradient">earnings</span>{" "}
            from unpredictable disruptions
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Rain, extreme heat, platform outages — when disruptions strike, RakshAI automatically detects your income drop and pays you <strong className="text-foreground">within minutes</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/onboarding")}
              className="gradient-primary text-white px-7 py-4 rounded-xl font-semibold text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 active:scale-[0.97] transition-all duration-200 inline-flex items-center justify-center gap-2 group"
            >
              Get Protected in 30 seconds
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="px-7 py-4 rounded-xl font-semibold text-base border border-border bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 active:scale-[0.97] transition-all duration-200 inline-flex items-center justify-center gap-2 text-foreground"
            >
              View Analytics
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </AnimatedSection>

        {/* Hero Visual */}
        <AnimatedSection delay={200} className="mt-14 max-w-sm mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-foreground/15 ring-1 ring-foreground/5">
            <img
              src={heroRider}
              alt="Delivery rider navigating through rain"
              className="w-full aspect-[4/5] object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Floating Alert Card */}
            <div className="absolute bottom-4 left-3 right-3">
              <div className="glass rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-warning flex items-center justify-center shrink-0">
                  <CloudRain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Rain disruption detected</p>
                  <p className="text-xs text-muted-foreground">Income protection active • ₹29/week</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-success">₹450</p>
                  <p className="text-[10px] text-muted-foreground">Auto-paid</p>
                </div>
              </div>
            </div>

            {/* Top Floating Badge */}
            <div className="absolute top-4 right-4">
              <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <span className="live-dot" />
                <span className="text-xs font-semibold text-foreground">Live monitoring</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Stats Bar */}
      <AnimatedSection>
        <section className="container pb-14">
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4 divide-x divide-border">
              <StatCounter value="₹2.3Cr" label="Total claims paid" />
              <StatCounter value="97%" label="Auto-approved" />
              <StatCounter value="< 3min" label="Avg payout time" />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
              Trusted by <strong className="text-foreground">12,400+</strong> delivery partners across Delhi, Mumbai, Bangalore, Hyderabad, Chennai & Pune
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Disruptions Section */}
      <section className="container pb-16">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">When disruptions hit, earnings drop</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Delivery partners lose <strong className="text-foreground">₹500–1500</strong> per disruption event. RakshAI bridges that gap automatically.
          </p>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {disruptions.map((d, i) => (
            <AnimatedSection key={d.label} delay={i * 80}>
              <div className="glass-card-hover p-5 text-center cursor-default">
                <div className={`w-12 h-12 rounded-2xl ${d.bg} flex items-center justify-center mx-auto mb-3`}>
                  <d.icon className={`w-6 h-6 ${d.color}`} />
                </div>
                <h3 className="font-semibold mb-1.5">{d.label}</h3>
                <p className="text-sm text-muted-foreground">{d.stat}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container pb-16">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Get covered in 3 steps</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {steps.map((s, i) => (
            <AnimatedSection key={s.num} delay={i * 100}>
              <div className="glass-card p-5 relative overflow-hidden">
                <div className="text-5xl font-black text-primary/8 absolute top-2 right-4 select-none">{s.num}</div>
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mb-3">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container pb-16">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">What makes RakshAI different</h2>
        </AnimatedSection>
        <div className="grid gap-4 max-w-lg mx-auto">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 80}>
              <div className="glass-card-hover p-5 flex gap-4">
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center shrink-0 shadow-md`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container pb-16">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Riders love RakshAI</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 80}>
              <div className="glass-card p-5 h-full flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.zone}</p>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.platform}</span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-20">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-10 max-w-2xl mx-auto text-center gradient-card">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Start protecting your earnings today</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Join 12,400+ delivery partners who never have to worry about disruption-driven income loss.
            </p>
            <button
              onClick={() => navigate("/onboarding")}
              className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 active:scale-[0.97] transition-all inline-flex items-center gap-2 group"
            >
              Get Protected in 30 seconds
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <div className="mt-6 flex justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> No paperwork</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> UPI instant payout</span>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
