export const mockRider = {
  id: "RDR-10284",
  name: "Arjun Kumar",
  phone: "+91 98765 43210",
  city: "Delhi NCR",
  zone: "Sector 18, Noida",
  platform: "Blinkit",
  zoneRiskScore: 72,
  reliabilityScore: 88,
  weeklyPremium: 29,
  coverageActive: true,
  expectedEarnings: 4200,
  actualEarnings: 3750,
  payoutAmount: 450,
  totalClaimsPaid: 3,
  memberSince: "Jan 2026",
  avgDeliveries: 42,
};

export const weatherAlerts = [
  { type: "rain", severity: "high", message: "Heavy rainfall expected tomorrow", probability: 85, time: "2 PM – 8 PM" },
  { type: "heat", severity: "medium", message: "Heat advisory — 42°C expected", probability: 60, time: "12 PM – 4 PM" },
  { type: "outage", severity: "low", message: "Scheduled maintenance tonight", probability: 40, time: "11 PM – 1 AM" },
];

export const earningsHistory = [
  { day: "Mon", expected: 680, actual: 680 },
  { day: "Tue", expected: 720, actual: 650 },
  { day: "Wed", expected: 700, actual: 710 },
  { day: "Thu", expected: 650, actual: 420 },
  { day: "Fri", expected: 750, actual: 690 },
  { day: "Sat", expected: 800, actual: 600 },
  { day: "Sun", expected: 900, actual: 0 },
];

export const transactionTimeline = [
  { time: "2:34 PM", event: "Income drop detected — 10.7% below threshold", type: "alert" as const },
  { time: "2:34 PM", event: "AI disruption model triggered (rain score: 91)", type: "process" as const },
  { time: "2:35 PM", event: "Earnings gap verified via platform API", type: "process" as const },
  { time: "2:35 PM", event: "Claim auto-approved (no manual review required)", type: "process" as const },
  { time: "2:37 PM", event: "₹450 credited to UPI: arjun@oksbi", type: "success" as const },
];

export const claimHistory = [
  { id: "CLM-2026-03847", date: "Mar 15", amount: 450, reason: "Rain disruption", status: "paid" },
  { id: "CLM-2026-02103", date: "Feb 28", amount: 380, reason: "Platform outage", status: "paid" },
  { id: "CLM-2026-01049", date: "Jan 19", amount: 520, reason: "Extreme heat", status: "paid" },
];

export const cities = ["Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune"];

export const zones: Record<string, string[]> = {
  "Delhi NCR": ["Sector 18, Noida", "Connaught Place", "Dwarka", "Gurugram Sec 29", "Lajpat Nagar"],
  Mumbai: ["Andheri West", "Bandra", "Powai", "Malad", "Thane West"],
  Bangalore: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "JP Nagar"],
  Hyderabad: ["Gachibowli", "Madhapur", "Jubilee Hills", "Kukatpally", "Secunderabad"],
  Chennai: ["Anna Nagar", "T. Nagar", "Adyar", "Velachery", "Perambur"],
  Pune: ["Kothrud", "Hinjewadi", "Viman Nagar", "Koregaon Park", "Wakad"],
};

// Zone risk scores for display
export const zoneRiskMap: Record<string, number> = {
  "Sector 18, Noida": 72,
  "Connaught Place": 58,
  "Dwarka": 64,
  "Gurugram Sec 29": 69,
  "Lajpat Nagar": 77,
  "Andheri West": 81,
  "Bandra": 74,
  "Powai": 66,
  "Malad": 70,
  "Koramangala": 61,
  "Indiranagar": 55,
  "Whitefield": 73,
  "Gachibowli": 68,
  "Madhapur": 62,
};

export const hourlyActivity = [
  { hour: "8AM", orders: 45, earnings: 180 },
  { hour: "9AM", orders: 72, earnings: 290 },
  { hour: "10AM", orders: 58, earnings: 232 },
  { hour: "11AM", orders: 85, earnings: 340 },
  { hour: "12PM", orders: 120, earnings: 480 },
  { hour: "1PM", orders: 110, earnings: 440 },
  { hour: "2PM", orders: 38, earnings: 152 },
  { hour: "3PM", orders: 22, earnings: 88 },
  { hour: "4PM", orders: 48, earnings: 192 },
  { hour: "5PM", orders: 95, earnings: 380 },
  { hour: "6PM", orders: 130, earnings: 520 },
  { hour: "7PM", orders: 140, earnings: 560 },
  { hour: "8PM", orders: 118, earnings: 472 },
  { hour: "9PM", orders: 88, earnings: 352 },
];
