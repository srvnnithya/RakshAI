import { useState, useEffect, useRef, useCallback } from "react";

export interface RealtimeMetrics {
  actualEarnings: number;
  orderVolume: number;        // 0-100 (% of normal)
  weatherSeverity: number;    // 0-100
  weatherLabel: string;
  platformStatus: "operational" | "degraded" | "outage";
  activeRiders: number;
  alertLevel: "low" | "medium" | "high" | "critical";
  lastUpdate: Date;
  disruptionActive: boolean;
  disruptionReason: string | null;
}

const WEATHER_LABELS = ["Clear", "Light rain", "Moderate rain", "Heavy rain", "Extreme heat", "Thunderstorm"];
const DISRUPTION_REASONS = ["Heavy rainfall", "Platform slowdown", "Extreme heat", "Network outage"];

function getAlertLevel(severity: number): RealtimeMetrics["alertLevel"] {
  if (severity < 25) return "low";
  if (severity < 50) return "medium";
  if (severity < 75) return "high";
  return "critical";
}

function getWeatherLabel(severity: number): string {
  const idx = Math.min(Math.floor(severity / 17), WEATHER_LABELS.length - 1);
  return WEATHER_LABELS[idx];
}

export function useRealtime(baseEarnings: number, active: boolean = true) {
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    actualEarnings: baseEarnings,
    orderVolume: 78,
    weatherSeverity: 35,
    weatherLabel: "Light rain",
    platformStatus: "operational",
    activeRiders: 142,
    alertLevel: "medium",
    lastUpdate: new Date(),
    disruptionActive: false,
    disruptionReason: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setMetrics(prev => {
      const weatherDrift = (Math.random() - 0.45) * 8;
      const newWeather = Math.max(0, Math.min(100, prev.weatherSeverity + weatherDrift));

      const volumeDrift = (Math.random() - 0.45) * 5;
      const newVolume = Math.max(10, Math.min(100, prev.orderVolume + volumeDrift));

      const earningsDrift = (Math.random() - 0.5) * 30;
      const newEarnings = Math.max(0, prev.actualEarnings + earningsDrift);

      const riderDrift = Math.round((Math.random() - 0.5) * 6);
      const newRiders = Math.max(80, Math.min(220, prev.activeRiders + riderDrift));

      const platformRoll = Math.random();
      const platformStatus: RealtimeMetrics["platformStatus"] =
        platformRoll > 0.97 ? "outage" : platformRoll > 0.88 ? "degraded" : "operational";

      const disruptionActive = newWeather > 70 || platformStatus === "outage";
      const disruptionReason = disruptionActive
        ? platformStatus === "outage"
          ? DISRUPTION_REASONS[3]
          : newWeather > 85
          ? DISRUPTION_REASONS[0]
          : DISRUPTION_REASONS[1]
        : null;

      return {
        actualEarnings: Math.round(newEarnings),
        orderVolume: Math.round(newVolume),
        weatherSeverity: Math.round(newWeather),
        weatherLabel: getWeatherLabel(newWeather),
        platformStatus,
        activeRiders: newRiders,
        alertLevel: getAlertLevel(newWeather),
        lastUpdate: new Date(),
        disruptionActive,
        disruptionReason,
      };
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(tick, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, tick]);

  const triggerDisruption = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      weatherSeverity: 88,
      weatherLabel: "Heavy rain",
      orderVolume: 22,
      platformStatus: "degraded",
      alertLevel: "critical",
      disruptionActive: true,
      disruptionReason: "Heavy rainfall",
      lastUpdate: new Date(),
    }));
  }, []);

  const resetDisruption = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      weatherSeverity: 20,
      weatherLabel: "Clear",
      orderVolume: 82,
      platformStatus: "operational",
      alertLevel: "low",
      disruptionActive: false,
      disruptionReason: null,
      lastUpdate: new Date(),
    }));
  }, []);

  return { metrics, triggerDisruption, resetDisruption };
}
