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
    description: "The simplest budget rule ever invented. Split your income into three buckets and wealth starts building itself without tracking every penny.",
    content: [
      {
        heading: "The Baseline of Wealth Creation",
        text: "The 50/30/20 rule is a proportional budgeting framework designed to automate your financial decisions. Instead of tracking every penny, you divide your post-tax (net) income into three buckets. This ensures you are always building wealth while still enjoying your life.",
      },
      {
        heading: "50%: Absolute Needs",
        text: [
          "Half of your income is allocated to survival and minimum obligations.",
          "Housing (rent or mortgage) covers essential shelter.",
          "Utilities and groceries handle food and basic services.",
          "Minimum debt payments are legal obligations you cannot skip.",
          "Health insurance and transportation keep you functioning day to day.",
          "Childcare or dependent care costs sit here too because they are non-negotiable.",
        ],
      },
      {
        heading: "30%: Discretionary Wants",
        text: "This is your lifestyle buffer. Dining out, vacations, subscriptions, entertainment, hobbies and personal services all live here. Capping this at 30% prevents lifestyle creep from consuming your rising income as you earn more over time.",
      },
      {
        heading: "20%: Aggressive Savings and Debt Paydown",
        text: [
          "This is the most critical bucket for long-term wealth. This money goes toward your emergency fund covering three to six months of expenses, high-interest debt payoff including credit cards and personal loans, investing in index funds and retirement accounts, and building passive income streams.",
        ],
      },
      {
        heading: "Real-World Implementation",
        text: [
          "With $5,000 per month in net income the numbers look like this. Needs at 50% means $2,500 for housing, utilities, insurance and groceries. Wants at 30% means $1,500 for dining, entertainment and subscriptions. Savings at 20% means $1,000 goes toward investing, debt paydown and your emergency fund.",
        ],
      },
    ],
  },
  {
    slug: "index-funds-vs-stocks",
    title: "Index Funds vs. Individual Stocks",
    category: "Investing",
    time: "8 min read",
    description: "Nine out of ten professional fund managers fail to beat the market over 15 years. Here is what that means for how you should be investing your money.",
    content: [
      {
        heading: "The Myth of Stock Picking",
        text: "Retail investors often believe that picking the next Amazon or Tesla is the path to wealth. However, data from S&P Dow Jones Indices consistently shows that over a 15-year period, nearly 90% of actively managed investment funds fail to beat the market.",
      },
      {
        heading: "Historical Data on Fund Performance",
        text: [
          "Over the 15-year period from 2008 to 2023, the S&P 500 index returned 11.2% annualised while 90% of managed funds underperformed it. Managed funds charge 0.5% to 2% in annual fees, which compounds dramatically over time. On a $100,000 starting investment over 30 years, an index fund charging 0.03% grows to $1,047,000 while a managed fund charging 1.0% grows to only $743,000. That $304,000 difference comes entirely from fees.",
        ],
      },
      {
        heading: "What is an Index Fund?",
        text: "An index fund or ETF is a basket of stocks that automatically tracks a specific market index. When you buy one share of an S&P 500 index fund, you instantly own a tiny piece of the 500 largest companies in America. The index rebalances itself so you never have to pick winners.",
      },
      {
        heading: "The Power of Diversification",
        text: "If you put all your money in one company and it goes bankrupt, you lose everything. With an index fund, if one company fails it is immediately replaced. This self-cleansing mechanism virtually eliminates single-company risk without requiring you to do anything.",
      },
      {
        heading: "Building Your Investment Strategy",
        text: [
          "Open a brokerage account with Vanguard, Fidelity or Charles Schwab. Choose your core index funds: VTI tracks the total US stock market, VXUS covers total international markets and BND covers the total bond market. Invest a fixed amount automatically every month. Rebalance once per year. Do not panic during market downturns.",
        ],
      },
    ],
  },
  {
    slug: "the-art-of-asset-allocation",
    title: "The Art of Asset Allocation",
    category: "Strategy",
    time: "7 min read",
    description: "Studies show 90% of your lifetime investment returns come from this single decision. Not which stocks you pick, but how you split your money across asset classes.",
    content: [
      {
        heading: "Why Asset Allocation Matters",
        text: "Asset allocation is the most important decision you will make as an investor. Studies show that 90% of your investment returns come from asset allocation, not from picking individual stocks. Getting this right matters far more than finding the perfect company to invest in.",
      },
      {
        heading: "Understanding Asset Classes",
        text: [
          "Stocks represent ownership in companies and offer higher growth potential with higher volatility. Bonds are loans to governments or corporations that provide stable income and lower growth. Cash held in savings accounts and money market funds offers low return but stays highly liquid. Real estate through direct property or REITs gives you tangible assets that require more capital. Commodities like oil, gold and agricultural products act as an inflation hedge.",
        ],
      },
      {
        heading: "Age-Based Allocation Strategies",
        text: [
          "In your 20s and 30s, 90% stocks and 10% bonds gives you time to recover from downturns. Between 35 and 50, shifting to 75% stocks and 25% bonds balances growth with stability. From 50 to 65, 60% stocks and 40% bonds provides conservative growth as retirement approaches. After 65, 40% stocks and 60% bonds prioritises capital preservation over growth.",
        ],
      },
      {
        heading: "The 70/20/10 Portfolio",
        text: [
          "Seventy percent in diversified stocks covering US and international markets creates wealth growth and captures market upside. Twenty percent in government and corporate bonds reduces volatility and provides steady income. Ten percent in cash builds an emergency fund buffer and keeps capital available to deploy during market downturns.",
        ],
      },
      {
        heading: "Rebalancing Your Portfolio",
        text: "Once per year, check your allocations. If stocks have grown from 70% to 76% of your portfolio, sell $6,000 worth of stocks and buy $6,000 of bonds. This automatically forces you to buy low and sell high without any emotional decision making.",
      },
    ],
  },
  {
    slug: "compound-interest",
    title: "Understanding Compound Interest",
    category: "Wealth",
    time: "4 min read",
    description: "Starting ten years earlier beats investing three times more money later. The maths behind this will permanently change how you think about time and money.",
    content: [
      {
        heading: "The Magic of Compound Interest",
        text: "Compound interest means earning returns on your returns. It is the mathematical phenomenon that turns small, consistent investments into massive wealth over time. Einstein reportedly called it the eighth wonder of the world, and once you see the numbers you will understand why.",
      },
      {
        heading: "The Formula",
        text: [
          "Future Value equals Present Value multiplied by one plus the interest rate raised to the power of years invested. With $10,000 at an 8% annual return: after 10 years you have $21,589, after 20 years $46,610, after 30 years $100,627 and after 40 years $217,245. Notice that the last decade adds more than the first three decades combined.",
        ],
      },
      {
        heading: "Why Time Matters More Than Money",
        text: [
          "Person A invests $5,000 per year for just 10 years starting at age 25, then stops completely. Total invested is $50,000 and the value at age 65 is $1,234,567.",
          "Person B waits until 35 then invests $5,000 per year for 30 years. Total invested is $150,000 and the value at age 65 is only $795,418.",
          "Person A invested less money, started earlier, and ended with significantly more. That gap is entirely explained by time.",
        ],
      },
      {
        heading: "How to Harness Compound Interest",
        text: [
          "Start as early as possible because every year counts exponentially more than the last. Invest consistently using dollar-cost averaging to remove emotion from the process. Keep expenses low because high fees compound negatively just like returns compound positively. Stay invested and do not panic sell during downturns. Reinvest dividends automatically so your returns generate their own returns.",
        ],
      },
    ],
  },
  {
    slug: "market-history-lessons",
    title: "Market History: Lessons from Crashes",
    category: "Investing",
    time: "6 min read",
    description: "Every single market crash in recorded history has recovered and hit new highs. Knowing this changes how you react when the next one arrives, which it will.",
    content: [
      {
        heading: "Why History Matters",
        text: "Human psychology has not changed in 200 years. People get greedy when markets rise and fearful when they fall. Understanding historical patterns helps you stay calm during crashes and recognise opportunities when others are panicking.",
      },
      {
        heading: "The Great Depression (1929 to 1939)",
        text: [
          "The stock market crashed 89% from peak to trough and took 25 years to recover to 1929 levels. Investors who held through the crash and bought during it earned over 12% annualised returns in the recovery. Investors who panic sold locked in 89% permanent losses.",
        ],
      },
      {
        heading: "Black Monday (October 19, 1987)",
        text: [
          "The largest single-day crash in history wiped out 22.6% of the market in one trading session. People believed the market would keep falling forever. It recovered fully within months. Those who sold on Black Monday missed the entire recovery. Those who stayed invested earned over 15% annualised returns in the years that followed.",
        ],
      },
      {
        heading: "The 2008 Financial Crisis",
        text: [
          "The S&P 500 fell 57% from peak to trough. People lost homes, jobs and retirement savings. The media declared the stock market dead. Investors who bought during 2008 and 2009 made over 400% returns by 2020. The best time to invest is when everyone else is terrified.",
        ],
      },
      {
        heading: "Key Takeaways",
        text: [
          "Every crash in history has been followed by recovery and new highs. Market timing does not work and even professionals cannot reliably predict bottoms. Dollar-cost averaging by investing regularly removes emotion from the equation. Your investment horizon is what determines outcomes, not short-term noise.",
        ],
      },
    ],
  },
  {
    slug: "tax-efficient-investing",
    title: "Tax-Efficient Investing Strategies",
    category: "Strategy",
    time: "9 min read",
    description: "The average investor loses 25% of their returns to taxes. A few simple account choices fix most of that legally and permanently, compounding the savings for decades.",
    content: [
      {
        heading: "The Power of Tax-Advantaged Accounts",
        text: "On average, 25 to 30% of your investment returns go to taxes. By using tax-advantaged accounts strategically, you can reduce this to 5 to 10%. That extra 15 to 20% compounds dramatically over 30 years and can mean hundreds of thousands of dollars in additional retirement wealth.",
      },
      {
        heading: "Tax-Advantaged Accounts Explained",
        text: [
          "A 401(k) or 403(b) uses pre-tax contributions that reduce your current taxes, often includes employer matching which is free money and allows up to $23,500 per year in 2024.",
          "A Traditional IRA offers tax-deductible contributions, tax-deferred growth and you pay taxes on withdrawal. The annual limit is $7,000.",
          "A Roth IRA uses post-tax contributions but delivers tax-free growth forever and tax-free withdrawals in retirement. The limit is also $7,000 per year.",
          "An HSA or Health Savings Account is the rarest account type because it offers a triple tax advantage: contributions are deductible, growth is tax-free and withdrawals for medical expenses are tax-free. The limit is $4,150 per year.",
        ],
      },
      {
        heading: "Asset Location Strategy",
        text: [
          "Tax-deferred accounts like your 401(k) and Traditional IRA are best for high-yield bonds and REITs because these generate taxable income every year.",
          "Your Roth IRA is best for high-growth stocks because you want your best performers growing in the account where gains are never taxed.",
          "Your taxable account works best for tax-efficient index funds you plan to hold long-term, minimising short-term trading that would be taxed as ordinary income.",
        ],
      },
      {
        heading: "Tax Loss Harvesting",
        text: [
          "When a taxable investment loses value, sell the losing position and claim the loss against your capital gains. This saves you 15 to 20% in taxes on the loss amount. Immediately buy a similar but not identical investment to stay invested in the market. The result is the same portfolio with a lower tax bill. On a $5,000 loss, this saves roughly $1,000 in taxes.",
        ],
      },
      {
        heading: "The Optimal Order of Operations",
        text: [
          "Step one: Maximise your 401(k) match because employer matching is a guaranteed 25 to 50% instant return. Step two: Max out your HSA because no other account offers triple tax advantages. Step three: Max out your Roth IRA for tax-free growth forever. Step four: Increase your 401(k) to the annual maximum. Step five: Use a taxable brokerage account for any remaining investments.",
        ],
      },
    ],
  },
];

