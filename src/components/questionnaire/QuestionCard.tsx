'use client';

import { cn } from '@/lib/utils';
import type { Question } from '@/lib/questionnaire/types';

interface QuestionCardProps {
  question: Question;
  sectionName: string;
  questionIndex: number;
  totalQuestions: number;
  /** For single-select: the selected option index. For multi-select: array of selected indices. */
  selectedIndices: number | number[] | undefined;
  onSelect: (indices: number | number[]) => void;
}

export default function QuestionCard({
  question,
  sectionName,
  questionIndex,
  totalQuestions,
  selectedIndices,
  onSelect,
}: QuestionCardProps) {
  const multiSelected = Array.isArray(selectedIndices) ? selectedIndices : [];

  function handleMultiToggle(idx: number) {
    const isNone = question.options[idx]?.label === 'None of the above';
    if (isNone) {
      // Toggle "none" — clears everything else
      onSelect(multiSelected.includes(idx) ? [] : [idx]);
      return;
    }
    // Remove "none" index if present, toggle the clicked index
    const noneIdx = question.options.findIndex(
      (o) => o.label === 'None of the above'
    );
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
          Question {questionIndex + 1} of {totalQuestions}
        </p>
      </div>

      <h2 className="text-xl font-semibold text-text-primary leading-relaxed">
        {question.text}
      </h2>

      {question.hint && (
        <p className="text-sm text-text-muted">{question.hint}</p>
      )}

      <div className="space-y-3">
        {question.options.map((option, i) => {
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
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
