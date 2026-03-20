// Admin dashboard mock data

export const adminKPIs = {
  totalActiveRiders: 12847,
  activePoliciesThisWeek: 9342,
  totalPayoutsTriggered: 3218,
  totalPayoutAmount: 23400000, // ₹2.34Cr
  lossRatio: 0.62,
  avgClaimProcessingMs: 168000, // 2m48s
  fraudFlaggedCount: 47,
  autoApprovalRate: 0.971,
};

export const payoutTrend = [
  { date: "Mar 1", payouts: 148, amount: 66600, premiums: 271200 },
  { date: "Mar 2", payouts: 92, amount: 41400, premiums: 270900 },
  { date: "Mar 3", payouts: 201, amount: 90450, premiums: 268200 },
  { date: "Mar 4", payouts: 165, amount: 74250, premiums: 269100 },
  { date: "Mar 5", payouts: 88, amount: 39600, premiums: 271500 },
  { date: "Mar 6", payouts: 312, amount: 140400, premiums: 270000 },
  { date: "Mar 7", payouts: 278, amount: 125100, premiums: 268800 },
  { date: "Mar 8", payouts: 142, amount: 63900, premiums: 267300 },
  { date: "Mar 9", payouts: 95, amount: 42750, premiums: 272100 },
  { date: "Mar 10", payouts: 188, amount: 84600, premiums: 270600 },
  { date: "Mar 11", payouts: 421, amount: 189450, premiums: 269700 },
  { date: "Mar 12", payouts: 356, amount: 160200, premiums: 271800 },
  { date: "Mar 13", payouts: 198, amount: 89100, premiums: 270300 },
  { date: "Mar 14", payouts: 102, amount: 45900, premiums: 271200 },
  { date: "Mar 15", payouts: 287, amount: 129150, premiums: 269400 },
];

export const disruptionsByType = [
  { type: "Heavy Rain", count: 1420, color: "#3b82f6" },
  { type: "Extreme Heat", count: 680, color: "#f97316" },
  { type: "Platform Outage", count: 340, color: "#ef4444" },
  { type: "Network Failure", count: 180, color: "#8b5cf6" },
  { type: "Traffic Surge", count: 120, color: "#eab308" },
];

export const zoneRiskGrid = [
  { zone: "Sector 18, Noida", city: "Delhi NCR", riskScore: 72, activeRiders: 284, disruptionLikelihood: 78, riskLevel: "high" as const },
  { zone: "Andheri West", city: "Mumbai", riskScore: 81, activeRiders: 421, disruptionLikelihood: 85, riskLevel: "high" as const },
  { zone: "Koramangala", city: "Bangalore", riskScore: 61, activeRiders: 318, disruptionLikelihood: 55, riskLevel: "medium" as const },
  { zone: "Gachibowli", city: "Hyderabad", riskScore: 68, activeRiders: 197, disruptionLikelihood: 62, riskLevel: "medium" as const },
  { zone: "Bandra", city: "Mumbai", riskScore: 74, activeRiders: 356, disruptionLikelihood: 71, riskLevel: "high" as const },
  { zone: "Indiranagar", city: "Bangalore", riskScore: 55, activeRiders: 241, disruptionLikelihood: 42, riskLevel: "low" as const },
  { zone: "Connaught Place", city: "Delhi NCR", riskScore: 58, activeRiders: 198, disruptionLikelihood: 48, riskLevel: "low" as const },
  { zone: "T. Nagar", city: "Chennai", riskScore: 65, activeRiders: 163, disruptionLikelihood: 60, riskLevel: "medium" as const },
  { zone: "Whitefield", city: "Bangalore", riskScore: 73, activeRiders: 289, disruptionLikelihood: 68, riskLevel: "high" as const },
  { zone: "Koregaon Park", city: "Pune", riskScore: 49, activeRiders: 142, disruptionLikelihood: 38, riskLevel: "low" as const },
  { zone: "Powai", city: "Mumbai", riskScore: 66, activeRiders: 278, disruptionLikelihood: 59, riskLevel: "medium" as const },
  { zone: "Madhapur", city: "Hyderabad", riskScore: 62, activeRiders: 185, disruptionLikelihood: 55, riskLevel: "medium" as const },
];

export const recentClaims = [
  { id: "CLM-10492", riderId: "RDR-10284", zone: "Sector 18, Noida", city: "Delhi NCR", expectedEarnings: 4200, actualEarnings: 3750, payoutAmount: 450, triggerReason: "Heavy rain", status: "auto_approved" as const, timestamp: "2:37 PM, Mar 20" },
  { id: "CLM-10491", riderId: "RDR-08821", zone: "Andheri West", city: "Mumbai", expectedEarnings: 3800, actualEarnings: 2100, payoutAmount: 1445, triggerReason: "Platform outage", status: "auto_approved" as const, timestamp: "1:52 PM, Mar 20" },
  { id: "CLM-10490", riderId: "RDR-07234", zone: "Koramangala", city: "Bangalore", expectedEarnings: 4500, actualEarnings: 4480, payoutAmount: 0, triggerReason: "False trigger", status: "flagged" as const, timestamp: "1:18 PM, Mar 20" },
  { id: "CLM-10489", riderId: "RDR-11045", zone: "Gachibowli", city: "Hyderabad", expectedEarnings: 3200, actualEarnings: 2400, payoutAmount: 680, triggerReason: "Extreme heat", status: "auto_approved" as const, timestamp: "12:44 PM, Mar 20" },
  { id: "CLM-10488", riderId: "RDR-09312", zone: "Bandra", city: "Mumbai", expectedEarnings: 5100, actualEarnings: 1200, payoutAmount: 1500, triggerReason: "Heavy rain", status: "flagged" as const, timestamp: "11:22 AM, Mar 20" },
  { id: "CLM-10487", riderId: "RDR-06789", zone: "T. Nagar", city: "Chennai", expectedEarnings: 2900, actualEarnings: 2650, payoutAmount: 212, triggerReason: "Network failure", status: "auto_approved" as const, timestamp: "10:15 AM, Mar 20" },
  { id: "CLM-10486", riderId: "RDR-05521", zone: "Whitefield", city: "Bangalore", expectedEarnings: 3700, actualEarnings: 2800, payoutAmount: 765, triggerReason: "Heavy rain", status: "auto_approved" as const, timestamp: "9:48 AM, Mar 20" },
];

export const fraudAlerts = [
  { id: "FRD-001", riderId: "RDR-09312", zone: "Bandra", severity: "critical" as const, type: "Unusual claim frequency", detail: "5 claims in 7 days — avg 1.2/month expected", reliabilityScore: 31, flaggedAt: "11:22 AM, Mar 20" },
  { id: "FRD-002", riderId: "RDR-07234", zone: "Koramangala", severity: "medium" as const, type: "GPS mismatch", detail: "Claim zone doesn't match last GPS ping (2.8km drift)", reliabilityScore: 58, flaggedAt: "1:18 PM, Mar 20" },
  { id: "FRD-003", riderId: "RDR-04119", zone: "Powai", severity: "high" as const, type: "Inconsistent activity", detail: "Reported full shift but app inactive for 4.5 hrs", reliabilityScore: 44, flaggedAt: "8:31 AM, Mar 20" },
  { id: "FRD-004", riderId: "RDR-12844", zone: "Gurugram Sec 29", severity: "medium" as const, type: "Earnings anomaly", detail: "Claimed ₹1500 gap during non-disruption window", reliabilityScore: 52, flaggedAt: "Mar 19, 6:14 PM" },
];

export const reliabilityDistribution = [
  { range: "0-20", count: 12, label: "Very Low" },
  { range: "21-40", count: 38, label: "Low" },
  { range: "41-60", count: 284, label: "Moderate" },
  { range: "61-80", count: 1842, label: "Good" },
  { range: "81-100", count: 7166, label: "Excellent" },
];

export const platformActivityFeed = [
  { time: "3:00 PM", zone: "Andheri West", activeRiders: 421, orderVolume: 100, status: "normal" as const },
  { time: "3:05 PM", zone: "Andheri West", activeRiders: 418, orderVolume: 97, status: "normal" as const },
  { time: "3:10 PM", zone: "Andheri West", activeRiders: 380, orderVolume: 82, status: "warning" as const },
  { time: "3:15 PM", zone: "Andheri West", activeRiders: 312, orderVolume: 55, status: "warning" as const },
  { time: "3:20 PM", zone: "Andheri West", activeRiders: 124, orderVolume: 28, status: "critical" as const },
  { time: "3:25 PM", zone: "Andheri West", activeRiders: 89, orderVolume: 18, status: "critical" as const },
];

export const aiInsights = [
  {
    type: "disruption_forecast" as const,
    priority: "high" as const,
    title: "High rainfall risk tomorrow — Zone A, B",
    detail: "Sector 18 Noida & Andheri West: 87% rain probability, 6PM–10PM. Recommend surge alert push.",
    suggestedAction: "Push surge protection alert to 420 riders in affected zones",
    impact: "+₹2,100 in premiums, -18% payout risk",
  },
  {
    type: "premium_adjustment" as const,
    priority: "medium" as const,
    title: "Raise base premium for Mumbai zones",
    detail: "Loss ratio in Mumbai zones reached 0.78 this week (threshold: 0.70). Adjust base premium +₹3.",
    suggestedAction: "Increase Mumbai base premium from ₹18 → ₹21",
    impact: "+₹8,400/week additional premium revenue",
  },
  {
    type: "fraud_risk" as const,
    priority: "high" as const,
    title: "Coordinated claim spike detected — Bandra",
    detail: "14 riders in Bandra submitted claims within a 90-min window with 0.12 km GPS radius.",
    suggestedAction: "Flag for manual review, temporarily pause auto-approval in zone",
    impact: "Potential ₹21,000 in fraudulent claims prevented",
  },
  {
    type: "platform_health" as const,
    priority: "low" as const,
    title: "Indiranagar activity trending up",
    detail: "12% rider activity increase vs last week. Order density rising — consider premium reduction.",
    suggestedAction: "Reduce Indiranagar risk weight by 0.05",
    impact: "Improve rider retention, +180 new policy signups estimated",
  },
];

export const pricingParams = {
  basePremium: 18,
  rainRiskWeight: 1.4,
  heatRiskWeight: 1.2,
  outageRiskWeight: 1.6,
  reliabilityDiscountRate: 0.12,
  platformFee: 2,
  gstRate: 0.18,
  maxPayoutPerWeek: 1500,
};

export const liveDisruptionAlerts = [
  { id: "ALT-001", zone: "Andheri West", type: "rain" as const, message: "72% activity drop in last 10 min", severity: "critical" as const, ridersAffected: 312, time: "Just now" },
  { id: "ALT-002", zone: "Sector 18, Noida", type: "rain" as const, message: "Heavy rainfall — 85% disruption probability", severity: "high" as const, ridersAffected: 198, time: "4 min ago" },
  { id: "ALT-003", zone: "Bandra", type: "platform" as const, message: "Order volume down 60% — platform degraded", severity: "high" as const, ridersAffected: 156, time: "9 min ago" },
  { id: "ALT-004", zone: "Gachibowli", type: "heat" as const, message: "Temperature: 44°C — heat threshold breached", severity: "medium" as const, ridersAffected: 88, time: "15 min ago" },
];
