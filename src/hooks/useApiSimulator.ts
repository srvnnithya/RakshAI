import { useCallback, useState } from "react";
import { toast } from "sonner";

export type ApiStatus = "idle" | "loading" | "success" | "error";

interface ApiCall {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH";
  payload?: Record<string, unknown>;
}

interface ApiResponse<T = unknown> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
  latency: number | null;
}

// Simulates a real API call with realistic latency + success/failure
async function simulateApiCall<T>(
  call: ApiCall,
  mockResponse: T,
  options: { failRate?: number; minMs?: number; maxMs?: number } = {}
): Promise<{ data: T; latency: number }> {
  const { failRate = 0.05, minMs = 400, maxMs = 1200 } = options;
  const latency = minMs + Math.random() * (maxMs - minMs);

  await new Promise(r => setTimeout(r, latency));

  if (Math.random() < failRate) {
    throw new Error(`API Error: ${call.endpoint} returned 503`);
  }

  return { data: mockResponse, latency: Math.round(latency) };
}

// Hook for coverage activation
export function useCoverageApi() {
  const [state, setState] = useState<ApiResponse<{ policyId: string; validUntil: string }>>({
    data: null, status: "idle", error: null, latency: null,
  });

  const activate = useCallback(async (premium: number) => {
    setState({ data: null, status: "loading", error: null, latency: null });
    toast.loading("Processing payment…", { id: "coverage-activation" });

    try {
      const result = await simulateApiCall(
        { endpoint: "/api/v1/policies/activate", method: "POST", payload: { premium } },
        { policyId: `POL-${Date.now()}`, validUntil: "2026-03-30" }
      );
      setState({ data: result.data, status: "success", error: null, latency: result.latency });
      toast.success("Coverage activated! ₹" + premium + " debited.", { id: "coverage-activation", duration: 4000 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      setState({ data: null, status: "error", error: msg, latency: null });
      toast.error("Activation failed. Try again.", { id: "coverage-activation" });
    }
  }, []);

  return { ...state, activate };
}

// Hook for claim submission
export function useClaimApi() {
  const [state, setState] = useState<ApiResponse<{ claimId: string; payoutAmount: number; processingTime: string }>>({
    data: null, status: "idle", error: null, latency: null,
  });

  const submitClaim = useCallback(async (expectedEarnings: number, actualEarnings: number, reason: string) => {
    setState({ data: null, status: "loading", error: null, latency: null });
    toast.loading("Verifying income gap…", { id: "claim-submit" });

    try {
      const payout = Math.round((expectedEarnings - actualEarnings) * 0.85);
      const result = await simulateApiCall(
        { endpoint: "/api/v1/claims/submit", method: "POST", payload: { expectedEarnings, actualEarnings, reason } },
        { claimId: `CLM-${Date.now()}`, payoutAmount: payout, processingTime: "2 min 48 sec" },
        { minMs: 1500, maxMs: 3000 }
      );
      setState({ data: result.data, status: "success", error: null, latency: result.latency });
      toast.success(`Claim approved! ₹${payout} will be credited.`, { id: "claim-submit", duration: 5000 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Claim submission failed";
      setState({ data: null, status: "error", error: msg, latency: null });
      toast.error("Claim failed. Our team has been alerted.", { id: "claim-submit" });
    }
  }, []);

  return { ...state, submitClaim };
}

// Hook for surge upgrade
export function useSurgeApi() {
  const [state, setState] = useState<ApiResponse<{ upgradeId: string; additionalCoverage: number }>>({
    data: null, status: "idle", error: null, latency: null,
  });

  const upgradeSurge = useCallback(async (additionalPremium: number) => {
    setState({ data: null, status: "loading", error: null, latency: null });
    toast.loading("Upgrading surge protection…", { id: "surge-upgrade" });

    try {
      const result = await simulateApiCall(
        { endpoint: "/api/v1/policies/surge", method: "PATCH", payload: { additionalPremium } },
        { upgradeId: `SUG-${Date.now()}`, additionalCoverage: 1000 }
      );
      setState({ data: result.data, status: "success", error: null, latency: result.latency });
      toast.success("Surge protection active! Extra ₹1000 coverage added.", { id: "surge-upgrade", duration: 4000 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upgrade failed";
      setState({ data: null, status: "error", error: msg, latency: null });
      toast.error("Upgrade failed. Try again.", { id: "surge-upgrade" });
    }
  }, []);

  return { ...state, upgradeSurge };
}

// Hook for weather/risk data fetch
export function useRiskDataApi() {
  const [state, setState] = useState<ApiResponse<{ riskScore: number; weather: string; probability: number }>>({
    data: null, status: "idle", error: null, latency: null,
  });

  const fetchRiskData = useCallback(async (zone: string) => {
    setState({ data: null, status: "loading", error: null, latency: null });

    try {
      const result = await simulateApiCall(
        { endpoint: `/api/v1/risk?zone=${encodeURIComponent(zone)}`, method: "GET" },
        {
          riskScore: Math.floor(Math.random() * 40) + 50,
          weather: "Heavy rain expected",
          probability: Math.floor(Math.random() * 30) + 60,
        },
        { minMs: 600, maxMs: 1400 }
      );
      setState({ data: result.data, status: "success", error: null, latency: result.latency });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Risk data fetch failed";
      setState({ data: null, status: "error", error: msg, latency: null });
    }
  }, []);

  return { ...state, fetchRiskData };
}
