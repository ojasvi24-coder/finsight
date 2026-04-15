export interface Article {
  slug: string;
  title: string;
  category: string;
  time: string;
  description: string;
  content: { heading?: string; text: string | string[] }[];
}

export const articles: Article[] = [
  {
    slug: "50-30-20-framework",
    title: "The 50/30/20 Framework",
    category: "Budgeting",
    time: "5 min read",
    description: "Learn how to strictly allocate your post-tax income into needs, wants, and aggressive savings.",
    content: [
      {
        heading: "The Baseline of Wealth Creation",
        text: "The 50/30/20 rule is a proportional budgeting framework designed to automate your financial decisions. Instead of tracking every penny, you divide your post-tax (net) income into three strict buckets. This ensures you are always building wealth while still enjoying your life."
      },
      {
        heading: "50%: Absolute Needs",
        text: [
          "Half of your income is allocated to survival and minimum obligations.",
          "• Housing (Rent/Mortgage)",
          "• Utilities & Groceries",
          "• Minimum debt payments",
          "• Health insurance and transportation"
        ]
      },
      {
        heading: "30%: Discretionary Wants",
        text: "This is your lifestyle buffer. Dining out, vacations, subscriptions, and entertainment live here. By capping this at 30%, you prevent lifestyle creep from consuming your rising income."
      },
      {
        heading: "20%: Aggressive Savings & Debt Paydown",
        text: "This is the most critical bucket. This money goes toward building your emergency fund, investing in index funds, and paying down high-interest debt (like credit cards). In the FinSight engine, hitting this 20% mark is the optimal threshold for long-term wealth."
      }
    ]
  },
  {
    slug: "index-funds-vs-stocks",
    title: "Index Funds vs. Individual Stocks",
    category: "Investing",
    time: "8 min read",
    description: "A data-driven breakdown of why broad-market index funds historically outperform active day trading.",
    content: [
      {
        heading: "The Myth of Stock Picking",
        text: "Retail investors often believe that picking the next Amazon or Tesla is the path to wealth. However, data from S&P Dow Jones Indices consistently shows that over a 15-year period, nearly 90% of actively managed investment funds fail to beat the market. If Wall Street professionals can't pick stocks accurately, retail investors shouldn't try."
      },
      {
        heading: "What is an Index Fund?",
        text: "An index fund (or ETF) is a basket of stocks that automatically tracks a specific market index, like the S&P 500. When you buy one share of an S&P 500 index fund (like VOO or FXAIX), you are instantly buying a tiny piece of the 500 largest companies in America."
      },
      {
        heading: "The Power of Diversification",
        text: "If you put all your money in one company and it goes bankrupt, you lose everything. If one company in an index fund goes bankrupt, it is immediately replaced by the next largest company. This self-cleansing mechanism virtually eliminates single-company risk while capturing the overall upward trajectory of the global economy."
      }
    ]
  },
  {
    slug: "compound-interest",
    title: "Understanding Compound Interest",
    category: "Wealth",
    time: "4 min read",
    description: "The mathematical phenomenon that turns consistent small investments into massive capital over time.",
    content: [
      {
        heading: "The Eighth Wonder of the World",
        text: "Compound interest is simply the interest you earn on your interest. It is the primary engine behind long-term wealth. When you invest money, it generates a return. In the next period, both your original money AND the return generate even more money, creating an exponential curve."
      },
      {
        heading: "The Math of Time",
        text: "The most important variable in compound interest is not how much money you invest, but how much TIME it has to grow. If you invest $500 a month starting at age 25 with an 8% return, you will have $1.7 million by age 65. If you wait until age 35 to start, you will only have $745,000. That 10-year delay costs you nearly a million dollars."
      },
      {
        heading: "Actionable Strategy",
        text: "Automate your investments. Set up a recurring transfer from your checking account to your brokerage account every payday. Time in the market always beats timing the market."
      }
    ]
  },
  {
    slug: "tax-advantaged-accounts",
    title: "Optimizing Tax-Advantaged Accounts",
    category: "Strategy",
    time: "10 min read",
    description: "How to leverage 401(k)s, IRAs, and HSAs to legally minimize your lifetime tax burden.",
    content: [
      {
        heading: "Shielding Your Wealth",
        text: "Taxes are the single largest expense you will pay in your lifetime. Governments offer legal tax loopholes (tax-advantaged accounts) to incentivize citizens to save for their own retirement and healthcare."
      },
      {
        heading: "Level 1: The 401(k) Match",
        text: "If your employer offers a 401(k) match, this is your first priority. A match is literal free money. If they match 5% of your salary, and you contribute 5%, you are getting a 100% guaranteed return on your investment immediately. Never leave a match on the table."
      },
      {
        heading: "Level 2: The Roth IRA",
        text: "A Roth IRA allows you to invest post-tax money today. The massive advantage? All the growth, dividends, and withdrawals in retirement are 100% tax-free. If your account grows to $2 million, you don't owe the government a single cent when you pull it out."
      },
      {
        heading: "Level 3: The HSA (Health Savings Account)",
        text: "The HSA is the only account in the US tax code with a 'triple-tax advantage'. Contributions are tax-deductible, growth is tax-free, and withdrawals for medical expenses are tax-free. Advanced investors pay for medical expenses out of pocket and let their HSA stay invested in the market to compound tax-free for decades."
      }
    ]
  }
];