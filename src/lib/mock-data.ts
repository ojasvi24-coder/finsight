export const monthlyTrends = [
  { month: "Jan", balance: 42000, spending: 3100 },
  { month: "Feb", balance: 44500, spending: 2800 },
  { month: "Mar", balance: 43200, spending: 4500 },
  { month: "Apr", balance: 46800, spending: 2900 },
  { month: "May", balance: 49000, spending: 3200 },
  { month: "Jun", balance: 52400, spending: 3000 },
];

export const spendingCategories = [
  { name: "Housing", value: 2000, fill: "#0f172a" },
  { name: "Food", value: 800, fill: "#334155" },
  { name: "Transport", value: 400, fill: "#64748b" },
  { name: "Entertainment", value: 300, fill: "#94a3b8" },
];

export const aiInsights = [
  {
    id: 1,
    type: "warning",
    message: "Your dining out expenses increased by 18% this month. Consider cooking at home to stay on budget.",
  },
  {
    id: 2,
    type: "success",
    message: "Great job! You saved 24% of your income this month, exceeding the recommended 20% rule.",
  },
  {
    id: 3,
    type: "info",
    message: "Top spending category: Housing (45%). This is within the normal threshold for your city.",
  }
];
