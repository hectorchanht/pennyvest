import type { Section, QuestionnaireResult, SectionScore } from './types';

export const sections: Section[] = [
  {
    id: 'capacity',
    name: 'Financial Situation & Capacity',
    weight: 0.3,
    maxScore: 55,
    questions: [
      {
        id: 'c1',
        text: 'What is your age?',
        options: [
          { label: 'Under 30', score: 5 },
          { label: '30–39', score: 4 },
          { label: '40–49', score: 3 },
          { label: '50–59', score: 2 },
          { label: '60 or older', score: 1 },
        ],
      },
      {
        id: 'c2',
        text: 'Highest level of education?',
        options: [
          { label: 'High school or below', score: 1 },
          { label: 'Diploma / Associate degree', score: 2 },
          { label: "Bachelor's degree", score: 3 },
          { label: "Master's degree", score: 4 },
          { label: 'Doctoral / Professional degree', score: 5 },
        ],
      },
      {
        id: 'c3',
        text: 'Annual household income (before tax)?',
        options: [
          { label: 'Under $50,000', score: 1 },
          { label: '$50,000–$99,999', score: 2 },
          { label: '$100,000–$199,999', score: 3 },
          { label: '$200,000–$499,999', score: 4 },
          { label: '$500,000 or more', score: 5 },
        ],
      },
      {
        id: 'c4',
        text: 'Approximate net worth?',
        options: [
          { label: 'Under $100,000', score: 1 },
          { label: '$100,000–$249,999', score: 2 },
          { label: '$250,000–$499,999', score: 3 },
          { label: '$500,000–$999,999', score: 4 },
          { label: '$1,000,000 or more', score: 5 },
        ],
      },
      {
        id: 'c5',
        text: 'Current employment situation?',
        options: [
          { label: 'Full-time employed with stable income', score: 4 },
          { label: 'Self-employed / variable income', score: 3 },
          { label: 'Retired', score: 2 },
          { label: 'Part-time / student / homemaker / unemployed', score: 1 },
        ],
      },
      {
        id: 'c6',
        text: 'Number of dependents?',
        options: [
          { label: 'None', score: 5 },
          { label: '1', score: 4 },
          { label: '2', score: 3 },
          { label: '3', score: 2 },
          { label: '4 or more', score: 1 },
        ],
      },
      {
        id: 'c7',
        text: 'Do you have emergency fund / liquid reserves?',
        options: [
          { label: 'Yes, more than 6 months', score: 5 },
          { label: 'Yes, 3–6 months', score: 4 },
          { label: 'Yes, but less than 3 months', score: 2 },
          { label: 'No', score: 1 },
        ],
      },
      {
        id: 'c8',
        text: 'Do you have significant debt?',
        options: [
          { label: 'No significant debt', score: 5 },
          { label: 'Yes, but easily manageable', score: 4 },
          { label: 'Yes, noticeable monthly payments', score: 2 },
          { label: 'Yes, heavy burden', score: 1 },
        ],
      },
      {
        id: 'c9',
        text: 'Years of investing experience?',
        options: [
          { label: 'None', score: 1 },
          { label: 'Less than 2 years', score: 2 },
          { label: '2–5 years', score: 3 },
          { label: '6–10 years', score: 4 },
          { label: 'More than 10 years', score: 5 },
        ],
      },
      {
        id: 'c10',
        text: 'Which have you previously invested in?',
        hint: 'Select all that apply. 1 point per selection.',
        multiSelect: true,
        options: [
          { label: 'Stocks / ETFs', score: 1 },
          { label: 'Bonds / Fixed income', score: 1 },
          { label: 'Mutual funds', score: 1 },
          { label: 'Real estate', score: 1 },
          { label: 'Cryptocurrency', score: 1 },
          { label: 'Options / Derivatives', score: 1 },
          { label: 'None of the above', score: 0 },
        ],
      },
      {
        id: 'c11',
        text: 'How would you rate your investment knowledge?',
        options: [
          { label: 'Beginner', score: 1 },
          { label: 'Intermediate', score: 3 },
          { label: 'Advanced', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'goals',
    name: 'Investment Goals & Time Horizon',
    weight: 0.3,
    maxScore: 35,
    questions: [
      {
        id: 'g1',
        text: 'What is your primary investing goal?',
        options: [
          { label: 'Safety net / Emergency fund', score: 1 },
          { label: 'Major purchase (home, car)', score: 2 },
          { label: 'Education funding', score: 3 },
          { label: 'Passive income', score: 3 },
          { label: 'Retirement', score: 4 },
          { label: 'Pure growth / Wealth building', score: 5 },
        ],
      },
      {
        id: 'g2',
        text: 'What is your target "finish line"?',
        options: [
          { label: 'Not sure yet', score: 3 },
          { label: 'Modest goal (basic security)', score: 2 },
          { label: 'Mid-tier goal (comfortable life)', score: 3 },
          { label: 'High-tier goal (financial freedom)', score: 4 },
          { label: 'Ambitious / Legacy goal', score: 5 },
        ],
      },
      {
        id: 'g3',
        text: 'What is your investment time horizon?',
        options: [
          { label: 'Short-term (less than 3 years)', score: 1 },
          { label: 'Near-term (3–5 years)', score: 2 },
          { label: 'Mid-term (6–10 years)', score: 3 },
          { label: 'Long-term (11–15 years)', score: 4 },
          { label: 'Ultra long-term (15+ years)', score: 5 },
        ],
      },
      {
        id: 'g4',
        text: 'Will you need to make early withdrawals?',
        options: [
          { label: 'No', score: 5 },
          { label: 'Possibly small / occasional', score: 3 },
          { label: 'Yes, regular / significant', score: 1 },
        ],
      },
      {
        id: 'g5',
        text: 'How important is regular income from investments?',
        options: [
          { label: 'Essential — I need it to live on', score: 1 },
          { label: 'Preferred but not critical', score: 3 },
          { label: 'Not important — reinvest everything', score: 5 },
        ],
      },
      {
        id: 'g6',
        text: 'What annual return are you targeting?',
        options: [
          { label: 'Conservative (0–4%)', score: 1 },
          { label: 'Moderate (4–7%)', score: 2 },
          { label: 'Balanced (7–10%)', score: 3 },
          { label: 'Aggressive (10%+)', score: 5 },
          { label: 'Unsure', score: 3 },
        ],
      },
      {
        id: 'g7',
        text: 'What happens if you don\'t achieve your investment goal?',
        options: [
          { label: 'Critical — would seriously affect my life', score: 1 },
          { label: 'Serious — would cause real hardship', score: 3 },
          { label: 'Manageable — I have flexibility', score: 5 },
        ],
      },
    ],
  },
  {
    id: 'tolerance',
    name: 'Risk Tolerance',
    weight: 0.4,
    maxScore: 35,
    questions: [
      {
        id: 't1',
        text: 'Which investing personality best describes you?',
        options: [
          { label: 'The Protector — safety above all', score: 1 },
          { label: 'The Cautious Builder — slow and steady', score: 2 },
          { label: 'The Balancer — mix of growth and safety', score: 3 },
          { label: 'The Growth Seeker — willing to ride waves', score: 4 },
          { label: 'The Opportunist — embrace volatility', score: 5 },
        ],
      },
      {
        id: 't2',
        text: 'If your portfolio dropped 20% in a month, what would you do?',
        options: [
          { label: 'Panic and sell everything', score: 1 },
          { label: 'Sell some to reduce risk', score: 2 },
          { label: 'Wait and watch', score: 3 },
          { label: 'Stay the course — stick to my plan', score: 4 },
          { label: 'Buy more — great opportunity', score: 5 },
        ],
      },
      {
        id: 't3',
        text: 'What is the maximum annual loss you could tolerate?',
        options: [
          { label: '0–5%', score: 1 },
          { label: '6–10%', score: 2 },
          { label: '11–15%', score: 3 },
          { label: '16–25%', score: 4 },
          { label: 'More than 25%', score: 5 },
        ],
      },
      {
        id: 't4',
        text: 'Which investment "journey" appeals to you most?',
        options: [
          { label: 'Smooth Path — 100% bonds/cash, minimal ups and downs', score: 1 },
          { label: 'Easy Incline — 70% bonds, 30% stocks', score: 2 },
          { label: 'Rolling Hills — 50/50 mix', score: 3 },
          { label: 'Mountain Trek — 30% bonds, 70% stocks', score: 4 },
          { label: 'Summit Climb — 100% stocks, maximum growth', score: 5 },
        ],
      },
      {
        id: 't5',
        text: 'How did you handle past market downturns?',
        options: [
          { label: 'Very stressed — sold investments', score: 1 },
          { label: 'Uncomfortable — considered selling', score: 2 },
          { label: 'Calm — held steady', score: 3 },
          { label: 'Saw it as an opportunity to buy', score: 5 },
          { label: 'Not applicable — first-time investor', score: 2 },
        ],
      },
      {
        id: 't6',
        text: 'Compared to others, how would you describe your risk appetite?',
        options: [
          { label: 'Much more conservative', score: 1 },
          { label: 'Somewhat more cautious', score: 2 },
          { label: 'About the same', score: 3 },
          { label: 'Somewhat more adventurous', score: 4 },
          { label: 'Much higher risk appetite', score: 5 },
        ],
      },
      {
        id: 't7',
        text: 'How do you feel about losses vs gains?',
        options: [
          { label: 'Avoiding losses is far more important than gains', score: 1 },
          { label: 'I feel losses about twice as strongly as gains', score: 3 },
          { label: 'I can accept losses for the chance of higher returns', score: 5 },
        ],
      },
    ],
  },
];

export function calculateResult(
  answers: Record<string, number | number[]>
): QuestionnaireResult {
  const sectionScores: SectionScore[] = sections.map((section) => {
    let rawScore = 0;
    for (const q of section.questions) {
      const answer = answers[q.id];
      if (answer === undefined) continue;
      if (Array.isArray(answer)) {
        rawScore += answer.reduce((sum, s) => sum + s, 0);
      } else {
        rawScore += answer;
      }
    }
    const percentage = (rawScore / section.maxScore) * 100;
    return {
      sectionId: section.id,
      sectionName: section.name,
      rawScore,
      maxScore: section.maxScore,
      percentage,
      weight: section.weight,
      weightedScore: percentage * section.weight,
    };
  });

  const overallScore = Math.round(
    sectionScores.reduce((sum, s) => sum + s.weightedScore, 0)
  );

  let riskBand: string;
  let profileSlug: 'conservative' | 'balanced' | 'aggressive';

  if (overallScore <= 25) {
    riskBand = 'Very Conservative';
    profileSlug = 'conservative';
  } else if (overallScore <= 40) {
    riskBand = 'Conservative';
    profileSlug = 'conservative';
  } else if (overallScore <= 55) {
    riskBand = 'Balanced';
    profileSlug = 'balanced';
  } else if (overallScore <= 70) {
    riskBand = 'Growth';
    profileSlug = 'aggressive';
  } else {
    riskBand = 'Aggressive';
    profileSlug = 'aggressive';
  }

  return { sectionScores, overallScore, riskBand, profileSlug };
}
