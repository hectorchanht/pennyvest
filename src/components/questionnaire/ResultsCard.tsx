'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import type { QuestionnaireResult } from '@/lib/questionnaire/types';

const profileColors: Record<string, string> = {
  conservative: 'text-blue-400',
  balanced: 'text-brand-green',
  aggressive: 'text-orange-400',
};

const profileDescriptions: Record<string, string> = {
  conservative:
    'You prefer stability and capital preservation. A portfolio weighted toward bonds, dividend stocks, and real assets suits your risk appetite.',
  balanced:
    'You seek a healthy mix of growth and safety. A diversified portfolio across all asset classes matches your goals.',
  aggressive:
    'You are comfortable with volatility for higher returns. A growth-oriented portfolio with heavy equity and crypto exposure fits your profile.',
};

export default function ResultsCard({ result }: { result: QuestionnaireResult }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-green">
          Your Result
        </p>
        <h2 className="text-3xl font-bold text-text-primary">
          {result.riskBand}
        </h2>
        <p className={`text-lg font-semibold ${profileColors[result.profileSlug]}`}>
          Score: {result.overallScore}/100
        </p>
      </div>

      {/* Score bar */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-brand-green to-orange-500 transition-all duration-1000"
            style={{ width: `${result.overallScore}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Aggressive</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed text-center">
        {profileDescriptions[result.profileSlug]}
      </p>

      {/* Section breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-primary">Score Breakdown</h3>
        {result.sectionScores.map((s) => (
          <div key={s.sectionId} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{s.sectionName}</span>
              <span className="text-text-primary font-medium">
                {Math.round(s.percentage)}%
                <span className="text-text-muted ml-1">
                  (weight: {Math.round(s.weight * 100)}%)
                </span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-green/70 transition-all duration-700"
                style={{ width: `${s.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 pt-4">
        <Link href="/profiles">
          <Button
            className="w-full bg-brand-green text-black hover:bg-brand-green/90"
            size="lg"
          >
            View Your Recommended Portfolio
          </Button>
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          Retake Questionnaire
        </Button>
      </div>
    </div>
  );
}
