import { QuizQuestion } from "@/components/KnowledgeCheck";

/**
 * Quizzes keyed by article slug. Adding a new quiz is as simple as adding a
 * new key here — the article page will render it automatically.
 */
export const quizzes: Record<string, QuizQuestion[]> = {
  "index-funds-vs-stocks": [
    {
      question:
        "Over a 15-year window, roughly what percentage of actively managed funds fail to beat the S&P 500?",
      options: ["About 30%", "About 50%", "About 90%", "About 10%"],
      correctIndex: 2,
      explanation:
        "S&P Dow Jones Indices data consistently shows ~90% of active funds underperform their benchmark over a 15-year window — a big reason low-cost index funds win by default.",
    },
    {
      question:
        "A 1% annual fund fee, compounded over 30 years, reduces a $100k starting investment by roughly how much?",
      options: ["~$30k", "~$100k", "~$300k", "~$10k"],
      correctIndex: 2,
      explanation:
        "Small fees compound just like returns do, in reverse. Over 30 years, 1% vs 0.03% fees can cost around $300k on a $100k starting balance.",
    },
    {
      question: "What does an S&P 500 index fund hold?",
      options: [
        "Only the best-performing stock of the year",
        "A basket tracking the 500 largest U.S. companies",
        "Only government bonds",
        "Futures contracts on commodities",
      ],
      correctIndex: 1,
      explanation:
        "An S&P 500 index fund automatically tracks the 500 largest U.S. companies. One bad apple can't sink you because the index self-rebalances.",
    },
  ],

  "50-30-20-framework": [
    {
      question: "Under the 50/30/20 rule, what goes in the 20% bucket?",
      options: [
        "Dining out and entertainment",
        "Rent, utilities, groceries",
        "Savings, investments, debt paydown",
        "Taxes",
      ],
      correctIndex: 2,
      explanation:
        "The 20% bucket is the wealth-building bucket: emergency fund, investing, and paying down high-interest debt.",
    },
    {
      question: "Which of these is considered a 'need' under the framework?",
      options: [
        "A streaming subscription",
        "Dinner at a restaurant",
        "Minimum debt payments",
        "A weekend trip",
      ],
      correctIndex: 2,
      explanation:
        "Minimum debt payments are legal obligations — non-discretionary, so they belong in the 50% needs bucket.",
    },
    {
      question:
        "On a $5,000/month net income, how much should go to 'wants' at the ceiling?",
      options: ["$500", "$1,000", "$1,500", "$2,500"],
      correctIndex: 2,
      explanation:
        "30% of $5,000 = $1,500. Capping wants at 30% is the guardrail against lifestyle creep.",
    },
  ],

  "compound-interest": [
    {
      question:
        "$10,000 invested at 8% annual return grows to roughly how much in 30 years?",
      options: ["$40,000", "$65,000", "$100,000", "$200,000"],
      correctIndex: 2,
      explanation:
        "At 8% annual compounding, $10k grows to ~$100,627 in 30 years. The doubling happens every ~9 years.",
    },
    {
      question:
        "Between starting early with less and starting late with more, which typically wins?",
      options: [
        "Starting late with more money",
        "Starting early with less money",
        "They always tie",
        "Neither — compound interest is a myth",
      ],
      correctIndex: 1,
      explanation:
        "Time matters more than dollars. Person A investing $5k/year for 10 years starting at 25 beats Person B investing $5k/year for 30 years starting at 35.",
    },
    {
      question:
        "Which habit most damages long-term compounding?",
      options: [
        "Reinvesting dividends",
        "Keeping fees low",
        "Panic-selling during downturns",
        "Automating contributions",
      ],
      correctIndex: 2,
      explanation:
        "Panic-selling locks in losses and pulls capital out at the worst time. Staying invested is the single biggest compounding advantage a retail investor has.",
    },
  ],
};
