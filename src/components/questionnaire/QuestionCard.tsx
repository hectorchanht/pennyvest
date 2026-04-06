'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Question } from '@/lib/questionnaire/types';

interface QuestionCardProps {
  question: Question;
  translatedText: string;
  translatedHint?: string;
  translatedOptions: string[];
  sectionName: string;
  questionIndex: number;
  totalQuestions: number;
  selectedIndices: number | number[] | undefined;
  onSelect: (indices: number | number[]) => void;
}

export default function QuestionCard({
  question,
  translatedText,
  translatedHint,
  translatedOptions,
  sectionName,
  questionIndex,
  totalQuestions,
  selectedIndices,
  onSelect,
}: QuestionCardProps) {
  const t = useTranslations('questionnaire');
  const multiSelected = Array.isArray(selectedIndices) ? selectedIndices : [];

  function handleMultiToggle(idx: number) {
    // "None of the above" is always the last option with score 0
    const isNone = question.options[idx]?.score === 0;
    if (isNone) {
      onSelect(multiSelected.includes(idx) ? [] : [idx]);
      return;
    }
    const noneIdx = question.options.findIndex((o) => o.score === 0);
    let next = multiSelected.filter((i) => i !== noneIdx);
    if (next.includes(idx)) {
      next = next.filter((i) => i !== idx);
    } else {
      next.push(idx);
    }
    onSelect(next);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-green">
          {sectionName}
        </p>
        <p className="text-sm text-text-muted">
          {t('questionOf', { current: questionIndex + 1, total: totalQuestions })}
        </p>
      </div>

      <h2 className="text-xl font-semibold text-text-primary leading-relaxed">
        {translatedText}
      </h2>

      {translatedHint && (
        <p className="text-sm text-text-muted">{translatedHint}</p>
      )}

      <div className="space-y-3">
        {translatedOptions.map((label, i) => {
          const active = question.multiSelect
            ? multiSelected.includes(i)
            : selectedIndices === i;

          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (question.multiSelect) {
                  handleMultiToggle(i);
                } else {
                  onSelect(i);
                }
              }}
              className={cn(
                'w-full rounded-lg border px-4 py-3 text-left text-sm transition-all',
                'hover:border-brand-green/50 hover:bg-surface-hover',
                active
                  ? 'border-brand-green bg-brand-green/10 text-text-primary'
                  : 'border-border bg-surface text-text-secondary'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
