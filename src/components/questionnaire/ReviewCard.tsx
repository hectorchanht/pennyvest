'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { sections } from '@/lib/questionnaire/questions';
import type { QuestionnaireResult } from '@/lib/questionnaire/types';
import { Button } from '@/components/ui/button';
import ResultsCard from './ResultsCard';

interface ReviewCardProps {
  answers: Record<string, number | number[]>;
  result: QuestionnaireResult;
  onAnswerChange: (questionId: string, value: number | number[]) => void;
  onRetake: () => void;
}

export default function ReviewCard({
  answers,
  result,
  onAnswerChange,
  onRetake,
}: ReviewCardProps) {
  const t = useTranslations('questionnaire');
  const [editingId, setEditingId] = useState<string | null>(null);

  function getSelectedLabel(questionId: string): string {
    const answer = answers[questionId];
    // Find the question
    for (const section of sections) {
      const q = section.questions.find((q) => q.id === questionId);
      if (!q) continue;
      if (Array.isArray(answer)) {
        if (answer.length === 0) return t(`q.${questionId}.o.${q.options.length - 1}` as 'q.c1.o.0');
        return answer.map((idx) => t(`q.${questionId}.o.${idx}` as 'q.c1.o.0')).join(', ');
      }
      if (typeof answer === 'number') {
        return t(`q.${questionId}.o.${answer}` as 'q.c1.o.0');
      }
    }
    return '—';
  }

  function handleOptionClick(questionId: string, question: typeof sections[0]['questions'][0], idx: number) {
    if (question.multiSelect) {
      const current = Array.isArray(answers[questionId]) ? [...(answers[questionId] as number[])] : [];
      const isNone = question.options[idx]?.score === 0;
      if (isNone) {
        onAnswerChange(questionId, current.includes(idx) ? [] : [idx]);
      } else {
        const noneIdx = question.options.findIndex((o) => o.score === 0);
        let next = current.filter((i) => i !== noneIdx);
        if (next.includes(idx)) {
          next = next.filter((i) => i !== idx);
        } else {
          next.push(idx);
        }
        onAnswerChange(questionId, next);
      }
    } else {
      onAnswerChange(questionId, idx);
      setEditingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <ResultsCard result={result} hideActions />

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-brand-green">
              {t(`sections.${section.id}` as 'sections.capacity')}
            </h3>

            {section.questions.map((q, qIdx) => {
              const isEditing = editingId === q.id;
              const answer = answers[q.id];
              const multiSelected = Array.isArray(answer) ? answer : [];

              return (
                <div
                  key={q.id}
                  className="rounded-lg border border-border bg-surface p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary font-medium">
                        {t(`q.${q.id}.text` as 'q.c1.text')}
                      </p>
                      {!isEditing && (
                        <p className="text-sm text-brand-green mt-1 truncate">
                          {getSelectedLabel(q.id)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(isEditing ? null : q.id)}
                      className="shrink-0 text-text-muted"
                    >
                      {isEditing ? t('done') : t('edit')}
                    </Button>
                  </div>

                  {isEditing && (
                    <div className="space-y-2 pt-1">
                      {q.options.map((option, i) => {
                        const active = q.multiSelect
                          ? multiSelected.includes(i)
                          : answer === i;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleOptionClick(q.id, q, i)}
                            className={cn(
                              'w-full rounded-lg border px-3 py-2 text-left text-sm transition-all',
                              'hover:border-brand-green/50 hover:bg-surface-hover',
                              active
                                ? 'border-brand-green bg-brand-green/10 text-text-primary'
                                : 'border-border bg-background text-text-secondary'
                            )}
                          >
                            {t(`q.${q.id}.o.${i}` as 'q.c1.o.0')}
                          </button>
                        );
                      })}
                      {q.multiSelect && (
                        <Button
                          size="sm"
                          className="mt-2 bg-brand-green text-black hover:bg-brand-green/90"
                          onClick={() => setEditingId(null)}
                        >
                          {t('done')}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onRetake}
        >
          {t('retake')}
        </Button>
      </div>
    </div>
  );
}
