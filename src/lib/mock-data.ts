export const monthlyTrends = [
  { month: "Jan", balance: 42000, spending: 3100 },
  { month: "Feb", balance: 44500, spending: 2800 },
  { month: "Mar", balance: 43200, spending: 4500 },
  { month: "Apr", balance: 46800, spending: 2900 },
  { month: "May", balance: 49000, spending: 3200 },
  { month: "Jun", balance: 52400, spending: 3000 },
];

export const aiInsights = [
  {
    id: 1,
    type: "warning",
    title: "Discretionary Spending Alert",
    message: "Dining expenses rose 18% this month ($820 → $970). You're tracking 5% over your $400/month target.",
    details: {
      metric: "Dining & Entertainment",
      current: "$970",
      target: "$400",
      variance: "+142%",
      trend: "↑ Increasing",
      recommendation: "Implement meal prepping 3x/week to reduce restaurant visits. This alone could save $200/month."
    },
    severity: "high",
    impact: "If this trend continues, you'll overspend by $6,840 annually"
  },
  {
    id: 2,
    type: "success",
    title: "Savings Rate Exceeds Goal",
    message: "You saved 24% of your income this month. You're on track for your Q3 investment goals (22% target).",
    details: {
      metric: "Savings Rate",
      current: "24%",
      target: "20%",
      variance: "+4%",
      trend: "↑ Improving",
      recommendation: "At this rate, you'll accumulate $8,400 in savings this quarter. Consider increasing your investment contributions to 10% of income."
    },
    severity: "low",
    impact: "Maintaining this rate puts you $1,200 ahead of your annual savings goal"
  },
  {
    id: 3,
    type: "info",
    title: "Housing Cost Optimization",
    message: "Top category: Housing (45%). This is optimal for the Bay Area market ($2,800/month).",
    details: {
      metric: "Housing Cost Ratio",
      current: "45%",
      target: "40%",
      variance: "+5%",
      benchmark: "30-40% (Standard) | 50%+ (Bay Area)",
      trend: "→ Stable",
      recommendation: "Your housing cost is 5% above the Bay Area average. Consider exploring refinancing options or roommate arrangements if possible."
    },
    severity: "medium",
    impact: "Reducing housing by 5% ($140) would free up $1,680/year for investments"
  },
  {
    id: 4,
    type: "success",
    title: "Investment Portfolio Growth",
    message: "Your investment contributions have grown by 12% YTD. You're on pace to reach $62,000 by end of year.",
    details: {
      metric: "Investment Growth",
      current: "$49,000",
      target: "$62,000",
      variance: "+12% YTD",
      trend: "↑ On Track",
      recommendation: "At your current $800/month contribution rate, you'll exceed your goal. Consider rebalancing between index funds (70%), bonds (20%), and cash (10%)."
    },
    severity: "low",
    impact: "On track to accumulate $156,000 over 3 years with compound growth"
  },
  {
    id: 5,
    type: "warning",
    title: "Utility Spending Anomaly",
    message: "Utilities spiked 32% in June ($180 → $238). Check for AC usage during heat wave.",
    details: {
      metric: "Monthly Utilities",
      current: "$238",
      average: "$180",
      variance: "+32%",
      trend: "↑ Spike Detected",
      recommendation: "Typical summer spike. Consider installing a programmable thermostat to reduce peak usage. One-time cost of $150 saves $30-40/month in summer."
    },
    severity: "medium",
    impact: "Seasonal adjustment expected; monitor for October reversion"
  },
  {
    id: 6,
    type: "info",
    title: "Tax-Advantaged Account Progress",
    message: "You've contributed $6,000 to your Roth IRA (60% of $10,000 annual goal). On track to max it out by July.",
    details: {
      metric: "Roth IRA Contributions",
      current: "$6,000",
      target: "$10,000",
      variance: "+60% of goal",
      trend: "→ On Schedule",
      recommendation: "Accelerate remaining $4,000 by July 15 to maximize tax-free growth window. Every $1,000 saved now grows to ~$4,200 in 20 years at 8% returns."
    },
    severity: "low",
    impact: "Tax savings: ~$1,500/year on $10,000 contribution"
  },
  {
    id: 7,
    type: "success",
    title: "Debt Paydown Acceleration",
    message: "Student loan principal decreased by $2,400 this quarter. You're ahead of schedule by 8%.",
    details: {
      metric: "Debt Reduction",
      current: "Quarter: -$2,400",
      scheduled: "-$2,200",
      variance: "+$200 ahead",
      trend: "↑ Accelerating",
      recommendation: "Continue with aggressive paydown. At current pace, you'll be debt-free 6 months early, saving ~$3,200 in interest."
    },
    severity: "low",
    impact: "Early payoff saves $8,000+ in lifetime interest costs"
  },
  {
    id: 8,
    type: "warning",
    title: "Emergency Fund Below Target",
    message: "Your emergency fund covers 4.2 months of expenses. Target is 6 months ($18,000).",
    details: {
      metric: "Emergency Fund",
      current: "$14,800",
      target: "$18,000",
      months_covered: "4.2",
      trend: "→ Stable",
      recommendation: "Increase emergency fund by $300/month to reach target in 11 months. Consider parking this in a high-yield savings account (5% APY) for $225/year return."
    },
    severity: "medium",
    impact: "Current fund protects against 4.2 months of job loss; target provides 6-month cushion"
  },
  {
    id: 9,
    type: "info",
    title: "Healthcare Spending Patterns",
    message: "Average monthly healthcare spend: $285. You're utilizing preventive care effectively.",
    details: {
      metric: "Healthcare Costs",
      current: "$285/month",
      benchmark: "$320/month (Your Demographic)",
      variance: "-11%",
      trend: "↓ Better Than Average",
      recommendation: "Maintain current preventive care routine. Consider maximizing HSA contributions ($4,150/year) if eligible—triple tax advantage saves $1,245 in taxes."
    },
    severity: "low",
    impact: "Preventive care saves $1,200+ annually by avoiding expensive treatments"
  },
  {
    id: 10,
    type: "success",
    title: "Subscription Cost Audit Complete",
    message: "Identified 3 unused subscriptions totaling $47/month ($564/year). Recommend cancellation.",
    details: {
      metric: "Unused Subscriptions",
      current: "$47/month",
      target: "$0/month",
      variance: "-$564/year potential savings",
      trend: "↓ Opportunity Found",
      recommendation: "Cancel unused services immediately. Redirect $47/month to investment account for automatic compound growth ($47 × 12 × 8% = $604 in 1 year)."
    },
    severity: "high",
    impact: "Free up $564/year for savings; 1-hour action, immediate impact"
  }
];

export const recentTransactions = [
  { id: "tx-1", name: "Apple Store", category: "Electronics", amount: -1299.00, date: "Today", status: "Completed" },
  { id: "tx-2", name: "Stripe Payout", category: "Income", amount: 4250.00, date: "Yesterday", status: "Completed" },
  { id: "tx-3", name: "Whole Foods", category: "Groceries", amount: -142.50, date: "Jun 12", status: "Pending" },
  { id: "tx-4", name: "Equinox Fitness", category: "Health", amount: -250.00, date: "Jun 10", status: "Completed" },
];

// Financial health metrics and recommendations
export const financialHealthMetrics = {
  savingsRate: {
    current: 24,
    target: 20,
    status: "excellent",
    advice: "You're saving above the recommended 20%. Consider allocating excess savings to long-term investments."
  },
  debtToIncomeRatio: {
    current: 12,
    target: 36,
    status: "excellent",
    advice: "Your debt-to-income ratio is healthy. You could safely take on a mortgage or other large loan if needed."
  },
  housingRatio: {
    current: 45,
    target: 30,
    status: "fair",
    advice: "Bay Area averages are 50%. You're performing well. Keep this ratio below 50% for optimal flexibility."
  },
  investmentDiversity: {
    current: "70% Stocks, 20% Bonds, 10% Cash",
    status: "good",
    advice: "Well-balanced portfolio for your age. Adjust allocation 10% more conservative every 5 years as you approach retirement."
  }
};

// Personalized recommendations based on profile
export const personalizedRecommendations = [
  {
    priority: "high",
    category: "Tax Optimization",
    title: "Maximize 401(k) Match",
    description: "You're contributing 6% to your 401(k). Your employer matches 5%. Ensure you're capturing full match.",
    action: "Verify 5% contribution minimum with payroll",
    potentialSavings: "$3,000/year in employer match"
  },
  {
    priority: "high",
    category: "Debt Management",
    title: "Student Loan Refinancing",
    description: "Current rate: 5.2%. Market rates: 3.8-4.2%. Potential savings: $156/month.",
    action: "Get quotes from SoFi, Citizens Bank, or LendingClub",
    potentialSavings: "$1,872/year"
  },
  {
    priority: "medium",
    category: "Investment Strategy",
    title: "Rebalance Portfolio",
    description: "Stock allocation has drifted to 75% due to market gains. Rebalance to maintain 70/20/10.",
    action: "Sell $2,000 of stocks, buy $2,000 of bonds",
    potentialSavings: "Risk reduction; 0.5% improved Sharpe ratio"
  },
  {
    priority: "medium",
    category: "Insurance Review",
    title: "Term Life Insurance Gap",
    description: "No term life insurance detected. Recommended: 10x annual income ($550,000) for $35/month.",
    action: "Get quote from PolicyGenius or Term4Sale",
    potentialSavings: "Protects dependents from $550k+ liability"
  },
  {
    priority: "low",
    category: "Lifestyle Optimization",
    title: "Reduce Housing Costs",
    description: "Explore rental market: 1BR apt $3,200 vs. current $2,800. You're doing well.",
    action: "Monitor market; lock current rate if lease renews",
    potentialSavings: "Already optimized; maintain current arrangement"
  }
];

